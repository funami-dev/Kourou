import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, Store } from '@ngxs/store';
import type { StateContext } from '@ngxs/store';

import { RandomSource } from '../../game/random';
import {
  NEW_GAME_STAFF,
  dismissMember,
  gainCountdownExperience,
  hireCandidate,
  recruitingFee,
  totalDailySalaries,
  updateCandidates
} from '../../game/staff/staff';
import type { Candidate, CrewMember, Staff } from '../../game/staff/staff.model';
import { GameDayStarted } from '../clock';
import { BookTransaction } from '../finance/finance.actions';
import { FinanceState } from '../finance/finance.state';
import { StartNewGame } from '../game.actions';
import { LaunchCompleted } from '../launch/launch.actions';
import { selectStaffCapacity } from '../spaceport.selectors';
import { DismissCrewMember, HireCandidate } from './staff.actions';

/** The people working at the spaceport, and the people who would like to. */
@State<Staff>({
  name: 'staff',
  defaults: NEW_GAME_STAFF
})
@Injectable()
export class StaffState {
  private readonly store = inject(Store);
  private readonly randomSource = inject(RandomSource);

  @Selector()
  static members(state: Staff): CrewMember[] {
    return state.members;
  }

  @Selector()
  static candidates(state: Staff): Candidate[] {
    return state.candidates;
  }

  @Action(HireCandidate)
  hire(ctx: StateContext<Staff>, { candidateId }: HireCandidate): void {
    const candidate = ctx.getState().candidates.find(({ id }) => id === candidateId);
    if (!candidate) {
      return;
    }
    const fee = recruitingFee(candidate);
    if (this.store.selectSnapshot(FinanceState.balance) < fee) {
      return;
    }

    const staff = hireCandidate(ctx.getState(), candidateId, this.store.selectSnapshot(selectStaffCapacity));
    if (staff) {
      ctx.setState(staff);
      ctx.dispatch(new BookTransaction(-fee, 'recruiting', candidate.name));
    }
  }

  @Action(DismissCrewMember)
  dismiss(ctx: StateContext<Staff>, { memberId }: DismissCrewMember): void {
    ctx.setState(dismissMember(ctx.getState(), memberId));
  }

  @Action(GameDayStarted)
  startDay(ctx: StateContext<Staff>, { day }: GameDayStarted): void {
    ctx.setState(updateCandidates(ctx.getState(), day, this.randomSource.next));
    const salaries = totalDailySalaries(ctx.getState().members);
    if (salaries > 0) {
      ctx.dispatch(new BookTransaction(-salaries, 'salaries'));
    }
  }

  @Action(LaunchCompleted)
  gainExperience(ctx: StateContext<Staff>, { mission }: LaunchCompleted): void {
    ctx.setState(gainCountdownExperience(ctx.getState(), mission.crew));
  }

  @Action(StartNewGame)
  reset(ctx: StateContext<Staff>): void {
    ctx.setState(NEW_GAME_STAFF);
  }
}
