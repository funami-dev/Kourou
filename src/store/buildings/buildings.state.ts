import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, Store } from '@ngxs/store';
import type { StateContext } from '@ngxs/store';

import type { Building } from '../../game/buildings/building.model';
import { dailyUpkeep, nextLevelPlan, startConstruction } from '../../game/buildings/buildings';
import { ClockState, GameDayStarted } from '../clock';
import { BookTransaction } from '../finance/finance.actions';
import { FinanceState } from '../finance/finance.state';
import { StartNewGame } from '../game.actions';
import { StartBuildingConstruction } from './buildings.actions';

export interface BuildingsStateModel {
  buildings: Building[];
}

export const NEW_GAME_BUILDINGS: BuildingsStateModel = { buildings: [] };

@State<BuildingsStateModel>({
  name: 'buildings',
  defaults: NEW_GAME_BUILDINGS
})
@Injectable()
export class BuildingsState {
  private readonly store = inject(Store);

  @Selector()
  static buildings(state: BuildingsStateModel): Building[] {
    return state.buildings;
  }

  /** Like rockets, buildings must be paid from the player's own money; the state grant does not cover them. */
  @Action(StartBuildingConstruction)
  startConstruction(ctx: StateContext<BuildingsStateModel>, { buildingType }: StartBuildingConstruction): void {
    const today = this.store.selectSnapshot(ClockState.currentDay);
    const plan = nextLevelPlan(ctx.getState().buildings, buildingType, today);
    if (!plan || this.store.selectSnapshot(FinanceState.balance) < plan.cost) {
      return;
    }

    const buildings = startConstruction(ctx.getState().buildings, buildingType, today);
    if (buildings) {
      ctx.setState({ buildings });
      ctx.dispatch(new BookTransaction(-plan.cost, 'construction'));
    }
  }

  @Action(GameDayStarted)
  payUpkeep(ctx: StateContext<BuildingsStateModel>, { day }: GameDayStarted): void {
    const upkeep = dailyUpkeep(ctx.getState().buildings, day);
    if (upkeep > 0) {
      ctx.dispatch(new BookTransaction(-upkeep, 'buildingUpkeep'));
    }
  }

  @Action(StartNewGame)
  reset(ctx: StateContext<BuildingsStateModel>): void {
    ctx.setState(NEW_GAME_BUILDINGS);
  }
}
