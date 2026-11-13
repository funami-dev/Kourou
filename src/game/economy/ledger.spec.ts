import { MAX_LEDGER_ENTRIES, STARTING_BALANCE, STATE_GRANT_TARGET_BALANCE } from './economy.constants';
import { NEW_GAME_LEDGER, book, summarize } from './ledger';
import type { Ledger } from './ledger';

describe('book', () => {
  it('records the transaction and updates the balance', () => {
    const ledger = book(NEW_GAME_LEDGER, { gameTimeMs: 1_000, amount: -250_000, category: 'operatingCosts' });

    expect(ledger.balance).toBe(STARTING_BALANCE - 250_000);
    expect(ledger.transactions).toEqual([{ id: 1, gameTimeMs: 1_000, amount: -250_000, category: 'operatingCosts' }]);
    expect(ledger.nextTransactionId).toBe(2);
  });

  it('lets the state step in when the balance drops below zero', () => {
    const almostBroke: Ledger = { ...NEW_GAME_LEDGER, balance: 100_000 };

    const ledger = book(almostBroke, { gameTimeMs: 1_000, amount: -250_000, category: 'operatingCosts' });

    expect(ledger.balance).toBe(STATE_GRANT_TARGET_BALANCE);
    expect(ledger.transactions.at(-1)).toEqual({
      id: 2,
      gameTimeMs: 1_000,
      amount: STATE_GRANT_TARGET_BALANCE + 150_000,
      category: 'stateGrant'
    });
  });

  it('does not involve the state when the balance reaches exactly zero', () => {
    const ledger = book(
      { ...NEW_GAME_LEDGER, balance: 250_000 },
      {
        gameTimeMs: 1_000,
        amount: -250_000,
        category: 'operatingCosts'
      }
    );

    expect(ledger.balance).toBe(0);
    expect(ledger.transactions).toHaveLength(1);
  });

  it('keeps only the most recent transactions', () => {
    let ledger = NEW_GAME_LEDGER;
    for (let index = 0; index < MAX_LEDGER_ENTRIES + 5; index++) {
      ledger = book(ledger, { gameTimeMs: index, amount: -1, category: 'operatingCosts' });
    }

    expect(ledger.transactions).toHaveLength(MAX_LEDGER_ENTRIES);
    expect(ledger.transactions[0]?.id).toBe(6);
  });
});

describe('summarize', () => {
  it('adds up income and expenses separately', () => {
    const { transactions } = [
      { gameTimeMs: 0, amount: -300, category: 'operatingCosts' as const },
      { gameTimeMs: 0, amount: 1_000, category: 'stateGrant' as const },
      { gameTimeMs: 0, amount: -200, category: 'operatingCosts' as const }
    ].reduce(book, NEW_GAME_LEDGER);

    expect(summarize(transactions)).toEqual({ income: 1_000, expenses: 500 });
  });
});
