import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, Store } from '@ngxs/store';
import type { StateContext } from '@ngxs/store';

import { laboratorySlots } from '../../game/buildings/buildings';
import { RESEARCH_POINTS_PER_FREE_LAB_SLOT_PER_DAY } from '../../game/buildings/buildings.constants';
import {
  NEW_GAME_RESEARCH_PROGRESS,
  addResearchPoints,
  completeResearchIfDue,
  startResearch,
  technologyBonuses
} from '../../game/research/research';
import { TECHNOLOGIES } from '../../game/research/technologies.constants';
import type { ResearchProgress, TechnologyBonuses } from '../../game/research/technology.model';
import { BuildingsState } from '../buildings';
import { ClockState, GameDayStarted } from '../clock';
import { BookTransaction } from '../finance/finance.actions';
import { FinanceState } from '../finance/finance.state';
import { StartNewGame } from '../game.actions';
import { StartResearch } from './research.actions';

/** The spaceport's own research: research points and the technology tree. */
@State<ResearchProgress>({
  name: 'research',
  defaults: NEW_GAME_RESEARCH_PROGRESS
})
@Injectable()
export class ResearchState {
  private readonly store = inject(Store);

  @Selector()
  static progress(state: ResearchProgress): ResearchProgress {
    return state;
  }

  @Selector()
  static researchPoints(state: ResearchProgress): number {
    return state.researchPoints;
  }

  /** The combined effect of all researched technologies. */
  @Selector()
  static bonuses(state: ResearchProgress): TechnologyBonuses {
    return technologyBonuses(state.unlockedTechnologies);
  }

  @Action(StartResearch)
  startResearch(ctx: StateContext<ResearchProgress>, { technologyId }: StartResearch): void {
    const today = this.store.selectSnapshot(ClockState.currentDay);
    const hasLaboratory = laboratorySlots(this.store.selectSnapshot(BuildingsState.buildings), today) > 0;
    const cost = TECHNOLOGIES[technologyId].cost;
    if (!hasLaboratory || this.store.selectSnapshot(FinanceState.balance) < cost) {
      return;
    }

    const progress = startResearch(ctx.getState(), technologyId, today);
    if (progress) {
      ctx.setState(progress);
      ctx.dispatch(new BookTransaction(-cost, 'research'));
    }
  }

  /** Each morning, finished research becomes available and every free lab slot produces research points. */
  @Action(GameDayStarted)
  startResearchDay(ctx: StateContext<ResearchProgress>, { day }: GameDayStarted): void {
    const freeLabSlots = laboratorySlots(this.store.selectSnapshot(BuildingsState.buildings), day);
    const progress = completeResearchIfDue(ctx.getState(), day);
    ctx.setState(addResearchPoints(progress, freeLabSlots * RESEARCH_POINTS_PER_FREE_LAB_SLOT_PER_DAY));
  }

  @Action(StartNewGame)
  reset(ctx: StateContext<ResearchProgress>): void {
    ctx.setState(NEW_GAME_RESEARCH_PROGRESS);
  }
}
