import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, Store } from '@ngxs/store';
import type { StateContext } from '@ngxs/store';

import { rocketBlueprints } from '../../game/rockets/rocket-design';
import type { LaunchExperience } from '../../game/rockets/rocket-design';
import type { RocketDesign } from '../../game/rockets/rocket-design.model';
import type { Rocket, RocketBlueprints } from '../../game/rockets/rocket.model';
import {
  NEW_GAME_ROCKET_FLEET,
  orderRocket,
  recordSuccessfulLaunch,
  removeRocket,
  saveDesign
} from '../../game/rockets/rocket-fleet';
import type { RocketFleet } from '../../game/rockets/rocket-fleet';
import { ClockState } from '../clock';
import { BookTransaction, FinanceState } from '../finance';
import { StartNewGame } from '../game.actions';
import { selectOrderBonuses } from '../spaceport.selectors';
import { LaunchCompleted } from '../launch/launch.actions';
import { OrderRocket, SaveRocketDesign } from './rockets.actions';

@State<RocketFleet>({
  name: 'rockets',
  defaults: NEW_GAME_ROCKET_FLEET
})
@Injectable()
export class RocketsState {
  private readonly store = inject(Store);

  @Selector()
  static rockets(state: RocketFleet): Rocket[] {
    return state.rockets;
  }

  @Selector()
  static designs(state: RocketFleet): RocketDesign[] {
    return state.designs;
  }

  @Selector()
  static launchExperience(state: RocketFleet): LaunchExperience {
    return state.launchExperience;
  }

  /** Catalogue models and own designs, with reliability including the spaceport's launch experience. */
  @Selector()
  static blueprints(state: RocketFleet): RocketBlueprints {
    return rocketBlueprints(state.designs, state.launchExperience);
  }

  /**
   * Rockets must be paid from the player's own money.
   * The state's grant only keeps the spaceport running; it does not pay for new rockets.
   */
  @Action(OrderRocket)
  order(ctx: StateContext<RocketFleet>, { blueprintId }: OrderRocket): void {
    const model = RocketsState.blueprints(ctx.getState())[blueprintId];
    if (!model || this.store.selectSnapshot(FinanceState.balance) < model.price) {
      return;
    }

    const nowMs = this.store.selectSnapshot(ClockState.gameTimeMs);
    const bonuses = this.store.selectSnapshot(selectOrderBonuses);
    const { fleet, rocket } = orderRocket(ctx.getState(), model, nowMs, bonuses);
    ctx.setState(fleet);
    ctx.dispatch(new BookTransaction(-model.price, 'rocketPurchase', `${model.name} ${rocket.serialName}`));
  }

  @Action(SaveRocketDesign)
  saveDesign(ctx: StateContext<RocketFleet>, { name, parts }: SaveRocketDesign): void {
    const fleet = saveDesign(ctx.getState(), name, parts);
    if (fleet) {
      ctx.setState(fleet);
    }
  }

  /**
   * A launched rocket is used up, whether it reached orbit or not.
   * Each success adds to the experience with its model or design.
   */
  @Action(LaunchCompleted)
  afterLaunch(ctx: StateContext<RocketFleet>, { outcome, mission }: LaunchCompleted): void {
    if (outcome === 'scrubbed') {
      return;
    }
    let fleet = removeRocket(ctx.getState(), mission.campaign.rocketId);
    if (outcome === 'success') {
      fleet = recordSuccessfulLaunch(fleet, mission.vehicle.blueprintId);
    }
    ctx.setState(fleet);
  }

  @Action(StartNewGame)
  reset(ctx: StateContext<RocketFleet>): void {
    ctx.setState(NEW_GAME_ROCKET_FLEET);
  }
}
