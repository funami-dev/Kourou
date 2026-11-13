import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, Store } from '@ngxs/store';
import type { StateContext } from '@ngxs/store';

import { startOfGameDay } from '../../game/clock/game-time';
import { DAILY_OPERATING_COSTS } from '../../game/economy/economy.constants';
import type { Euros } from '../../game/economy/economy.constants';
import { NEW_GAME_LEDGER, book } from '../../game/economy/ledger';
import type { Ledger, Transaction } from '../../game/economy/ledger';
import { ClockState, GameDayStarted } from '../clock';
import { StartNewGame } from '../game.actions';
import { BookTransaction } from './finance.actions';

@State<Ledger>({
  name: 'finance',
  defaults: NEW_GAME_LEDGER
})
@Injectable()
export class FinanceState {
  private readonly store = inject(Store);

  @Selector()
  static balance(state: Ledger): Euros {
    return state.balance;
  }

  @Selector()
  static transactions(state: Ledger): Transaction[] {
    return state.transactions;
  }

  @Action(BookTransaction)
  bookTransaction(ctx: StateContext<Ledger>, { amount, category }: BookTransaction): void {
    const gameTimeMs = this.store.selectSnapshot(ClockState.gameTimeMs);
    ctx.setState(book(ctx.getState(), { gameTimeMs, amount, category }));
  }

  @Action(GameDayStarted)
  payDailyOperatingCosts(ctx: StateContext<Ledger>, { day }: GameDayStarted): void {
    ctx.setState(
      book(ctx.getState(), {
        gameTimeMs: startOfGameDay(day),
        amount: -DAILY_OPERATING_COSTS,
        category: 'operatingCosts'
      })
    );
  }

  @Action(StartNewGame)
  reset(ctx: StateContext<Ledger>): void {
    ctx.setState(NEW_GAME_LEDGER);
  }
}
