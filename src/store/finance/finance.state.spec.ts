import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import { GAME_TIME_PER_REAL_TIME, MS_PER_DAY } from '../../game/clock/clock.constants';
import { DAILY_OPERATING_COSTS, STARTING_BALANCE } from '../../game/economy/economy.constants';
import { AdvanceClock, ClockState } from '../clock';
import { StartNewGame } from '../game.actions';
import { GuiState } from '../gui';
import { BookTransaction } from './finance.actions';
import { FinanceState } from './finance.state';

describe('FinanceState', () => {
  let store: Store;

  const balance = (): number => store.selectSnapshot(FinanceState.balance);
  const realTimeUntilNextMidnight = (): number => {
    const gameTimeUntilMidnight = MS_PER_DAY - (store.selectSnapshot(ClockState.gameTimeMs) % MS_PER_DAY);
    return gameTimeUntilMidnight / GAME_TIME_PER_REAL_TIME;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideStore([ClockState, FinanceState, GuiState])]
    });
    store = TestBed.inject(Store);
  });

  it('starts a new game with the starting balance', () => {
    expect(balance()).toBe(STARTING_BALANCE);
  });

  it('books a transaction at the current game time', () => {
    store.dispatch(new BookTransaction(5_000_000, 'stateGrant'));

    expect(balance()).toBe(STARTING_BALANCE + 5_000_000);
    expect(store.selectSnapshot(FinanceState.transactions)[0]?.gameTimeMs).toBe(
      store.selectSnapshot(ClockState.gameTimeMs)
    );
  });

  it('pays the daily operating costs when a new day begins', () => {
    store.dispatch(new AdvanceClock(realTimeUntilNextMidnight()));

    expect(balance()).toBe(STARTING_BALANCE - DAILY_OPERATING_COSTS);
    expect(store.selectSnapshot(FinanceState.transactions)).toEqual([
      { id: 1, gameTimeMs: MS_PER_DAY, amount: -DAILY_OPERATING_COSTS, category: 'operatingCosts' }
    ]);
  });

  it('resets the finances when a new game starts', () => {
    store.dispatch(new BookTransaction(-1_000, 'operatingCosts'));
    store.dispatch(new StartNewGame());

    expect(balance()).toBe(STARTING_BALANCE);
    expect(store.selectSnapshot(FinanceState.transactions)).toEqual([]);
  });
});
