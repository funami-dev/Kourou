import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, Store } from '@ngxs/store';
import type { StateContext } from '@ngxs/store';

import type { Contract } from '../../game/contracts/contract.model';
import { remainingPaymentFor } from '../../game/contracts/contract-market';
import type { Euros } from '../../game/economy/economy.constants';
import type { TransactionCategory } from '../../game/economy/ledger';
import { advanceCountdown, createCountdown, decideOnIssue, isCountdownFinished } from '../../game/launch/countdown';
import type { LaunchConditions } from '../../game/launch/countdown';
import { rocketsAvailableFor } from '../../game/launch/launch-campaign';
import { PAD_FEE_PER_DAY, PAD_REPAIR_COSTS_AFTER_FAILURE, SCRUB_COSTS } from '../../game/launch/launch.constants';
import type { Countdown, LaunchCampaign, LaunchMission, LaunchOutcome } from '../../game/launch/launch.model';
import { LiveConditionsService } from '../../game/live-conditions/live-conditions.service';
import { RandomSource } from '../../game/random';
import { selectRideshareExperiments } from '../../game/research/research-contracts';
import { REPUTATION_CHANGE_BY_OUTCOME } from '../../game/reputation/reputation';
import type { Rocket } from '../../game/rockets/rocket.model';
import { rocketDisplayName } from '../../game/rockets/rocket-fleet';
import { ROCKET_MODELS } from '../../game/rockets/rockets.constants';
import { ClockState, GameDayStarted } from '../clock';
import { ContractDeadlinesMissed, ContractsState } from '../contracts';
import { BookTransaction } from '../finance';
import { StartNewGame } from '../game.actions';
import { ResearchState } from '../research';
import { ResearchContractsState } from '../research-contracts/research-contracts.state';
import { RocketsState } from '../rockets';
import {
  AdvanceCountdown,
  CloseCountdown,
  DecideOnCountdownIssue,
  LaunchCompleted,
  MoveRocketToPad,
  RemoveRocketFromPad,
  StartCountdown
} from './launch.actions';
import type { LaunchResult, LaunchStateModel } from './launch.model';

export const NEW_GAME_LAUNCH: LaunchStateModel = {
  campaign: null,
  countdown: null,
  lastResult: null
};

@State<LaunchStateModel>({
  name: 'launch',
  defaults: NEW_GAME_LAUNCH
})
@Injectable()
export class LaunchState {
  private readonly store = inject(Store);
  private readonly liveConditions = inject(LiveConditionsService);
  private readonly randomSource = inject(RandomSource);

  @Selector()
  static campaign(state: LaunchStateModel): LaunchCampaign | null {
    return state.campaign;
  }

  @Selector()
  static countdown(state: LaunchStateModel): Countdown | null {
    return state.countdown;
  }

  @Selector()
  static lastResult(state: LaunchStateModel): LaunchResult | null {
    return state.lastResult;
  }

  /** While the countdown screen is open, game time stands still. */
  @Selector()
  static isCountdownOpen(state: LaunchStateModel): boolean {
    return state.countdown !== null;
  }

  @Action(MoveRocketToPad)
  moveRocketToPad(ctx: StateContext<LaunchStateModel>, { contractId, rocketId }: MoveRocketToPad): void {
    const contract = this.findContract(contractId);
    if (ctx.getState().campaign !== null || contract?.status !== 'inProgress') {
      return;
    }

    const nowMs = this.store.selectSnapshot(ClockState.gameTimeMs);
    const rockets = this.store.selectSnapshot(RocketsState.rockets);
    const isRocketAvailable = rocketsAvailableFor(contract, rockets, null, nowMs).some(({ id }) => id === rocketId);
    if (isRocketAvailable) {
      ctx.patchState({ campaign: { contractId, rocketId } });
    }
  }

  @Action(RemoveRocketFromPad)
  removeRocketFromPad(ctx: StateContext<LaunchStateModel>): void {
    if (ctx.getState().countdown === null) {
      ctx.patchState({ campaign: null });
    }
  }

  @Action(StartCountdown)
  startCountdown(ctx: StateContext<LaunchStateModel>): void {
    const { campaign, countdown } = ctx.getState();
    const contract = campaign && this.findContract(campaign.contractId);
    const rocket = campaign && this.findRocket(campaign.rocketId);
    if (countdown !== null || !campaign || !contract || !rocket) {
      return;
    }

    const rocketModel = ROCKET_MODELS[rocket.modelId];
    const spareCapacityKg = rocketModel.payloadCapacityKg[contract.payload.targetOrbit] - contract.payload.massKg;
    const rideshareExperiments = selectRideshareExperiments(
      this.store.selectSnapshot(ResearchContractsState.contracts),
      spareCapacityKg
    );
    const mission = {
      campaign,
      rocketModelId: rocket.modelId,
      targetOrbit: contract.payload.targetOrbit,
      bonuses: this.store.selectSnapshot(ResearchState.bonuses),
      rideshareContractIds: rideshareExperiments.map(({ id }) => id)
    };
    ctx.patchState({ countdown: createCountdown(mission, this.randomSource.next), lastResult: null });
  }

  @Action(AdvanceCountdown)
  advanceCountdown(ctx: StateContext<LaunchStateModel>, { realElapsedMs }: AdvanceCountdown): void {
    const { countdown } = ctx.getState();
    if (countdown === null || isCountdownFinished(countdown)) {
      return;
    }

    this.updateCountdown(
      ctx,
      advanceCountdown(countdown, realElapsedMs, this.launchConditions(), this.randomSource.next)
    );
  }

  @Action(DecideOnCountdownIssue)
  decide(ctx: StateContext<LaunchStateModel>, { decision }: DecideOnCountdownIssue): void {
    const { countdown } = ctx.getState();
    if (countdown !== null) {
      this.updateCountdown(ctx, decideOnIssue(countdown, decision));
    }
  }

  @Action(CloseCountdown)
  closeCountdown(ctx: StateContext<LaunchStateModel>): void {
    const { countdown } = ctx.getState();
    if (countdown !== null && isCountdownFinished(countdown)) {
      ctx.patchState({ countdown: null });
    }
  }

  @Action(GameDayStarted)
  payPadFee(ctx: StateContext<LaunchStateModel>): void {
    if (ctx.getState().campaign !== null) {
      ctx.dispatch(new BookTransaction(-PAD_FEE_PER_DAY, 'padFees'));
    }
  }

  /** A rocket waiting for a contract that has expired goes back into the fleet. */
  @Action(ContractDeadlinesMissed)
  releasePadForMissedContract(ctx: StateContext<LaunchStateModel>, { contractIds }: ContractDeadlinesMissed): void {
    const { campaign, countdown } = ctx.getState();
    if (campaign && countdown === null && contractIds.includes(campaign.contractId)) {
      ctx.patchState({ campaign: null });
    }
  }

  @Action(StartNewGame)
  reset(ctx: StateContext<LaunchStateModel>): void {
    ctx.setState(NEW_GAME_LAUNCH);
  }

  private updateCountdown(ctx: StateContext<LaunchStateModel>, countdown: Countdown): void {
    const wasFinished = ctx.getState().countdown?.status.kind === 'finished';
    ctx.patchState({ countdown });

    if (!wasFinished && countdown.status.kind === 'finished') {
      this.completeLaunch(ctx, countdown.status.outcome, countdown.mission);
    }
  }

  /** Books the money, records the result and tells contracts, rockets and reputation how the launch ended. */
  private completeLaunch(ctx: StateContext<LaunchStateModel>, outcome: LaunchOutcome, mission: LaunchMission): void {
    const { campaign, rideshareContractIds } = mission;
    const contract = this.findContract(campaign.contractId);
    const rocket = this.findRocket(campaign.rocketId);
    if (!contract || !rocket) {
      return;
    }

    const booking = launchBooking(outcome, contract);
    ctx.dispatch(
      new BookTransaction(booking.amount, booking.category, `${contract.customer} · ${contract.payload.name}`)
    );

    ctx.patchState({
      // After a scrub the rocket stays on the pad for another attempt.
      campaign: outcome === 'scrubbed' ? campaign : null,
      lastResult: {
        outcome,
        customer: contract.customer,
        payloadName: contract.payload.name,
        rocketName: rocketDisplayName(rocket),
        income: Math.max(0, booking.amount),
        costs: Math.max(0, -booking.amount),
        reputationChange: REPUTATION_CHANGE_BY_OUTCOME[outcome],
        rideshareExperiments: rideshareContractIds.length
      }
    });
    ctx.dispatch(new LaunchCompleted(outcome, campaign, rideshareContractIds));
  }

  private launchConditions(): LaunchConditions {
    return {
      site: this.liveConditions.site(),
      weather: this.liveConditions.weather(),
      nowMs: Date.now()
    };
  }

  private findContract(contractId: number): Contract | undefined {
    return this.store.selectSnapshot(ContractsState.contracts).find(({ id }) => id === contractId);
  }

  private findRocket(rocketId: number): Rocket | undefined {
    return this.store.selectSnapshot(RocketsState.rockets).find(({ id }) => id === rocketId);
  }
}

/** Money booked when a countdown ends: the rest of the payment, repairs after a failure, or the costs of a scrub. */
function launchBooking(outcome: LaunchOutcome, contract: Contract): { amount: Euros; category: TransactionCategory } {
  switch (outcome) {
    case 'success':
      return { amount: remainingPaymentFor(contract), category: 'contractPayment' };
    case 'failure':
      return { amount: -PAD_REPAIR_COSTS_AFTER_FAILURE, category: 'padRepair' };
    case 'scrubbed':
      return { amount: -SCRUB_COSTS, category: 'scrubCosts' };
  }
}
