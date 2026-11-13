import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import { GAME_TIME_PER_REAL_TIME, MS_PER_DAY } from '../../game/clock/clock.constants';
import { STARTING_BALANCE } from '../../game/economy/economy.constants';
import { RandomSource } from '../../game/random';
import { recruitingFee, totalDailySalaries } from '../../game/staff/staff';
import { STARTING_CREW } from '../../game/staff/staff.constants';
import { AdvanceClock, ClockState } from '../clock';
import { FinanceState } from '../finance';
import { GuiState } from '../gui';
import { DismissCrewMember, HireCandidate } from './staff.actions';
import { StaffState } from './staff.state';

describe('StaffState', () => {
  let store: Store;

  const passOneDay = (): void => {
    const gameTimeUntilMidnight = MS_PER_DAY - (store.selectSnapshot(ClockState.gameTimeMs) % MS_PER_DAY);
    store.dispatch(new AdvanceClock(gameTimeUntilMidnight / GAME_TIME_PER_REAL_TIME));
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideStore([ClockState, FinanceState, GuiState, StaffState]),
        { provide: RandomSource, useValue: { next: () => 0 } }
      ]
    });
    store = TestBed.inject(Store);
  });

  it('starts with a complete team', () => {
    expect(store.selectSnapshot(StaffState.members)).toEqual(STARTING_CREW);
  });

  it('pays salaries every day and receives applications', () => {
    passOneDay();

    expect(store.selectSnapshot(FinanceState.transactions)).toContainEqual(
      expect.objectContaining({ category: 'salaries', amount: -totalDailySalaries(STARTING_CREW) })
    );
    expect(store.selectSnapshot(StaffState.candidates)).toHaveLength(1);
  });

  it('hires a candidate for a recruiting fee', () => {
    passOneDay();
    const candidate = store.selectSnapshot(StaffState.candidates)[0]!;
    const balanceBefore = store.selectSnapshot(FinanceState.balance);

    store.dispatch(new HireCandidate(candidate.id));

    expect(store.selectSnapshot(StaffState.members)).toContainEqual(expect.objectContaining({ id: candidate.id }));
    expect(store.selectSnapshot(FinanceState.balance)).toBe(balanceBefore - recruitingFee(candidate));
    expect(balanceBefore).toBeLessThan(STARTING_BALANCE);
  });

  it('dismisses a member', () => {
    store.dispatch(new DismissCrewMember(STARTING_CREW[0]!.id));

    expect(store.selectSnapshot(StaffState.members)).toHaveLength(STARTING_CREW.length - 1);
  });
});
