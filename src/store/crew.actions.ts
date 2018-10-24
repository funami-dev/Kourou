export class AddCrewMember {
  static readonly type = '[Crew] Add a crew member';
  constructor(public payload: string) {}
}
