import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, Store } from '@ngxs/store';
import type { StateContext } from '@ngxs/store';

import { laboratorySlots } from '../../game/buildings/buildings';
import { RandomSource } from '../../game/random';
import type {
  ResearchContract,
  ResearchContractMarket,
  ResearchOffer
} from '../../game/research/research-contract.model';
import {
  NEW_GAME_RESEARCH_CONTRACT_MARKET,
  acceptResearchOffer,
  settleRideshareExperiments,
  startResearchContractDay
} from '../../game/research/research-contracts';
import { BuildingsState } from '../buildings/buildings.state';
import { ClockState, GameDayStarted } from '../clock';
import { BookTransaction } from '../finance/finance.actions';
import { StartNewGame } from '../game.actions';
import { LaunchCompleted } from '../launch/launch.actions';
import { AddResearchPoints } from '../research/research.actions';
import { AcceptResearchOffer } from './research-contracts.actions';

/** Research commissioned by clients: studies in the lab and experiments that ride along on launches. */
@State<ResearchContractMarket>({
  name: 'researchContracts',
  defaults: NEW_GAME_RESEARCH_CONTRACT_MARKET
})
@Injectable()
export class ResearchContractsState {
  private readonly store = inject(Store);
  private readonly randomSource = inject(RandomSource);

  @Selector()
  static market(state: ResearchContractMarket): ResearchContractMarket {
    return state;
  }

  @Selector()
  static offers(state: ResearchContractMarket): ResearchOffer[] {
    return state.offers;
  }

  @Selector()
  static contracts(state: ResearchContractMarket): ResearchContract[] {
    return state.contracts;
  }

  @Action(AcceptResearchOffer)
  accept(ctx: StateContext<ResearchContractMarket>, { offerId }: AcceptResearchOffer): void {
    const today = this.store.selectSnapshot(ClockState.currentDay);
    const labSlots = laboratorySlots(this.store.selectSnapshot(BuildingsState.buildings), today);
    const market = acceptResearchOffer(ctx.getState(), offerId, labSlots, today);
    if (market) {
      ctx.setState(market);
    }
  }

  @Action(GameDayStarted)
  startDay(ctx: StateContext<ResearchContractMarket>, { day }: GameDayStarted): void {
    const { market, completedContracts } = startResearchContractDay(ctx.getState(), day, this.randomSource.next);
    ctx.setState(market);
    this.payFor(ctx, completedContracts);
  }

  /** Experiments on board are delivered with a successful launch and lost with a failed one. */
  @Action(LaunchCompleted)
  settleRideshare(ctx: StateContext<ResearchContractMarket>, { outcome, mission }: LaunchCompleted): void {
    if (outcome === 'scrubbed') {
      return;
    }
    const { market, completedContracts } = settleRideshareExperiments(
      ctx.getState(),
      mission.rideshareContractIds,
      outcome === 'success'
    );
    ctx.setState(market);
    this.payFor(ctx, completedContracts);
  }

  @Action(StartNewGame)
  reset(ctx: StateContext<ResearchContractMarket>): void {
    ctx.setState(NEW_GAME_RESEARCH_CONTRACT_MARKET);
  }

  /** Completed research brings the client's payment and research points for the spaceport's own research. */
  private payFor(ctx: StateContext<ResearchContractMarket>, completedContracts: readonly ResearchContract[]): void {
    for (const { terms } of completedContracts) {
      ctx.dispatch([
        new BookTransaction(terms.payment, 'researchContractPayment', terms.client),
        new AddResearchPoints(terms.researchPoints)
      ]);
    }
  }
}
