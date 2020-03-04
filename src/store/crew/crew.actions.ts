export class AddCrewMember {
  static readonly type = '[Crew] Add a crew member';
  constructor(public payload) {}
}
export class RemoveCrewMember {
  static readonly type = '[Crew] Remove a crew member';
  constructor(public payload) {}
}
