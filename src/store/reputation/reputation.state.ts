import { Injectable } from '@angular/core';
import { Action, Selector, State } from '@ngxs/store';
import type { StateContext } from '@ngxs/store';

import {
  REPUTATION_CHANGE_BY_OUTCOME,
  REPUTATION_CHANGE_FOR_MISSED_DEADLINE,
  STARTING_REPUTATION,
  changeReputation
} from '../../game/reputation/reputation';
import { ContractDeadlinesMissed } from '../contracts';
import { StartNewGame } from '../game.actions';
import { LaunchCompleted } from '../launch';

export interface ReputationStateModel {
  /** Points from 0 to 100. */
  points: number;
}

/** How customers see the spaceport. Grows with successful launches, shrinks with failures and missed deadlines. */
@State<ReputationStateModel>({
  name: 'reputation',
  defaults: { points: STARTING_REPUTATION }
})
@Injectable()
export class ReputationState {
  @Selector()
  static points(state: ReputationStateModel): number {
    return state.points;
  }

  @Action(LaunchCompleted)
  afterLaunch(ctx: StateContext<ReputationStateModel>, { outcome }: LaunchCompleted): void {
    ctx.patchState({ points: changeReputation(ctx.getState().points, REPUTATION_CHANGE_BY_OUTCOME[outcome]) });
  }

  @Action(ContractDeadlinesMissed)
  afterMissedDeadlines(ctx: StateContext<ReputationStateModel>, { contractIds }: ContractDeadlinesMissed): void {
    const change = contractIds.length * REPUTATION_CHANGE_FOR_MISSED_DEADLINE;
    ctx.patchState({ points: changeReputation(ctx.getState().points, change) });
  }

  @Action(StartNewGame)
  reset(ctx: StateContext<ReputationStateModel>): void {
    ctx.setState({ points: STARTING_REPUTATION });
  }
}
