import { MAX_LEDGER_ENTRIES, STARTING_BALANCE, STATE_GRANT_TARGET_BALANCE } from './economy.constants';
import type { Euros } from './economy.constants';

/** What a transaction was for. Extended as new parts of the economy are added. */
export type TransactionCategory =
  | 'operatingCosts'
  | 'stateGrant'
  | 'contractAdvance'
  | 'contractPayment'
  | 'rocketPurchase'
  | 'padFees'
  | 'scrubCosts'
  | 'padRepair'
  | 'construction'
  | 'buildingUpkeep'
  | 'research'
  | 'researchContractPayment'
  | 'salaries'
  | 'recruiting';

export interface Transaction {
  id: number;
  /** Game time at which the transaction was booked. */
  gameTimeMs: number;
  /** Positive for income, negative for expenses. */
  amount: Euros;
  category: TransactionCategory;
  /** What exactly the transaction refers to, e.g. a customer and satellite. Proper names, not translated. */
  reference?: string;
}

export interface Ledger {
  balance: Euros;
  /** Most recent transactions, oldest first. */
  transactions: Transaction[];
  nextTransactionId: number;
}

export type Booking = Omit<Transaction, 'id'>;

export const NEW_GAME_LEDGER: Ledger = {
  balance: STARTING_BALANCE,
  transactions: [],
  nextTransactionId: 1
};

/**
 * Books a transaction and updates the balance.
 * If the balance drops below zero, the state steps in with a grant in the same moment.
 */
export function book(ledger: Ledger, booking: Booking): Ledger {
  const updatedLedger = appendTransaction(ledger, booking);

  if (updatedLedger.balance >= 0) {
    return updatedLedger;
  }

  return appendTransaction(updatedLedger, {
    gameTimeMs: booking.gameTimeMs,
    amount: STATE_GRANT_TARGET_BALANCE - updatedLedger.balance,
    category: 'stateGrant'
  });
}

function appendTransaction(ledger: Ledger, booking: Booking): Ledger {
  const transaction: Transaction = { id: ledger.nextTransactionId, ...booking };

  return {
    balance: ledger.balance + booking.amount,
    transactions: [...ledger.transactions, transaction].slice(-MAX_LEDGER_ENTRIES),
    nextTransactionId: ledger.nextTransactionId + 1
  };
}

/** Sums up income and expenses of the given transactions. Expenses are returned as a positive amount. */
export function summarize(transactions: readonly Transaction[]): { income: Euros; expenses: Euros } {
  return transactions.reduce(
    (summary, { amount }) =>
      amount >= 0
        ? { ...summary, income: summary.income + amount }
        : { ...summary, expenses: summary.expenses - amount },
    { income: 0, expenses: 0 }
  );
}
