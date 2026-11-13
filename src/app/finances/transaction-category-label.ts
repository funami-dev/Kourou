import type { TransactionCategory } from '../../game/economy/ledger';

/** Player-facing names of transaction categories. A `Record` makes sure every category has a label. */
const TRANSACTION_CATEGORY_LABELS: Record<TransactionCategory, string> = {
  operatingCosts: $localize`:@@finances.category.operatingCosts:Betriebskosten`,
  stateGrant: $localize`:@@finances.category.stateGrant:Staatliche Förderung`,
  contractAdvance: $localize`:@@finances.category.contractAdvance:Anzahlung Auftrag`,
  contractPayment: $localize`:@@finances.category.contractPayment:Zahlung nach erfolgreichem Start`,
  rocketPurchase: $localize`:@@finances.category.rocketPurchase:Raketenkauf`,
  padFees: $localize`:@@finances.category.padFees:Gebühr Startrampe`,
  scrubCosts: $localize`:@@finances.category.scrubCosts:Kosten Startabbruch`,
  padRepair: $localize`:@@finances.category.padRepair:Reparatur Startrampe`,
  construction: $localize`:@@finances.category.construction:Bau`,
  buildingUpkeep: $localize`:@@finances.category.buildingUpkeep:Unterhalt Gebäude`,
  research: $localize`:@@finances.category.research:Forschung`,
  researchContractPayment: $localize`:@@finances.category.researchContractPayment:Zahlung Forschungsauftrag`
};

export function transactionCategoryLabel(category: TransactionCategory): string {
  return TRANSACTION_CATEGORY_LABELS[category];
}
