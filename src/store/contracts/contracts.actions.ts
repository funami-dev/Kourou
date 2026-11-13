export class AcceptContractOffer {
  static readonly type = '[Contracts] Accept offer';

  constructor(public readonly offerId: number) {}
}

/** Announces contracts whose launch deadline has just passed. */
export class ContractDeadlinesMissed {
  static readonly type = '[Contracts] Deadlines missed';

  constructor(public readonly contractIds: number[]) {}
}
