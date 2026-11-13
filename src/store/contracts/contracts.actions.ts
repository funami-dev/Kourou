export class AcceptContractOffer {
  static readonly type = '[Contracts] Accept offer';

  constructor(public readonly offerId: number) {}
}
