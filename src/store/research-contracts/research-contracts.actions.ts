export class AcceptResearchOffer {
  static readonly type = '[Research contracts] Accept offer';

  constructor(public readonly offerId: number) {}
}
