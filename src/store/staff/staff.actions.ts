export class HireCandidate {
  static readonly type = '[Staff] Hire candidate';

  constructor(public readonly candidateId: number) {}
}

export class DismissCrewMember {
  static readonly type = '[Staff] Dismiss crew member';

  constructor(public readonly memberId: number) {}
}
