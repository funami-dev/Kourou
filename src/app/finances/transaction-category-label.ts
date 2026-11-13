import type { TransactionCategory } from '../../game/economy/ledger';

/** Player-facing names of transaction categories. A `Record` makes sure every category has a label. */
const TRANSACTION_CATEGORY_LABELS: Record<TransactionCategory, string> = {
  operatingCosts: $localize`:@@finances.category.operatingCosts:Betriebskosten`,
  stateGrant: $localize`:@@finances.category.stateGrant:Staatliche Förderung`
};

export function transactionCategoryLabel(category: TransactionCategory): string {
  return TRANSACTION_CATEGORY_LABELS[category];
}
