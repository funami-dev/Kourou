import type { Euros } from '../../game/economy/economy.constants';
import type { TransactionCategory } from '../../game/economy/ledger';

/** Books income (positive amount) or an expense (negative amount) at the current game time. */
export class BookTransaction {
  static readonly type = '[Finance] Book transaction';

  constructor(
    public readonly amount: Euros,
    public readonly category: TransactionCategory,
    public readonly reference?: string
  ) {}
}
