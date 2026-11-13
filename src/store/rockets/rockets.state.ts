import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, Store } from '@ngxs/store';
import type { StateContext } from '@ngxs/store';

import type { Rocket } from '../../game/rockets/rocket.model';
import { NEW_GAME_ROCKET_FLEET, orderRocket, removeRocket } from '../../game/rockets/rocket-fleet';
import type { RocketFleet } from '../../game/rockets/rocket-fleet';
import { ROCKET_MODELS } from '../../game/rockets/rockets.constants';
import { ClockState } from '../clock';
import { BookTransaction, FinanceState } from '../finance';
import { StartNewGame } from '../game.actions';
import { ResearchState } from '../research/research.state';
import { LaunchCompleted } from '../launch/launch.actions';
import { OrderRocket } from './rockets.actions';

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

  /**
   * Rockets must be paid from the player's own money.
   * The state's grant only keeps the spaceport running; it does not pay for new rockets.
   */
  @Action(OrderRocket)
  order(ctx: StateContext<RocketFleet>, { modelId }: OrderRocket): void {
    const model = ROCKET_MODELS[modelId];
    if (this.store.selectSnapshot(FinanceState.balance) < model.price) {
      return;
    }

    const nowMs = this.store.selectSnapshot(ClockState.gameTimeMs);
    const bonuses = this.store.selectSnapshot(ResearchState.bonuses);
    const { fleet, rocket } = orderRocket(ctx.getState(), modelId, nowMs, bonuses);
    ctx.setState(fleet);
    ctx.dispatch(new BookTransaction(-model.price, 'rocketPurchase', `${model.name} ${rocket.serialName}`));
  }

  /** A launched rocket is used up, whether it reached orbit or not. */
  @Action(LaunchCompleted)
  removeLaunchedRocket(ctx: StateContext<RocketFleet>, { outcome, campaign }: LaunchCompleted): void {
    if (outcome !== 'scrubbed') {
      ctx.setState(removeRocket(ctx.getState(), campaign.rocketId));
    }
  }

  @Action(StartNewGame)
  reset(ctx: StateContext<RocketFleet>): void {
    ctx.setState(NEW_GAME_ROCKET_FLEET);
  }
}
