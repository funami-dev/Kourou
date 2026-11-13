import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, Store } from '@ngxs/store';
import type { StateContext } from '@ngxs/store';

import { laboratorySlots } from '../../game/buildings/buildings';
import { RESEARCH_POINTS_PER_FREE_LAB_SLOT_PER_DAY } from '../../game/buildings/buildings.constants';
import { BuildingsState } from '../buildings';
import { GameDayStarted } from '../clock';
import { StartNewGame } from '../game.actions';

export interface ResearchStateModel {
  /** Research points collected and not yet spent. */
  researchPoints: number;
}

export const NEW_GAME_RESEARCH: ResearchStateModel = { researchPoints: 0 };

/** The spaceport's own research: research points and the technology tree. */
@State<ResearchStateModel>({
  name: 'research',
  defaults: NEW_GAME_RESEARCH
})
@Injectable()
export class ResearchState {
  private readonly store = inject(Store);

  @Selector()
  static researchPoints(state: ResearchStateModel): number {
    return state.researchPoints;
  }

  /** Every free lab slot produces research points each day. */
  @Action(GameDayStarted)
  collectResearchPoints(ctx: StateContext<ResearchStateModel>, { day }: GameDayStarted): void {
    const freeLabSlots = laboratorySlots(this.store.selectSnapshot(BuildingsState.buildings), day);
    ctx.patchState({
      researchPoints: ctx.getState().researchPoints + freeLabSlots * RESEARCH_POINTS_PER_FREE_LAB_SLOT_PER_DAY
    });
  }

  @Action(StartNewGame)
  reset(ctx: StateContext<ResearchStateModel>): void {
    ctx.setState(NEW_GAME_RESEARCH);
  }
}
