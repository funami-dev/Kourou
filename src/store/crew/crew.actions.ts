import { PersonModel } from './crew.model';
export class AddCrewMember {
  static readonly type = '[Crew] Add a crew member';
  constructor(public payload: PersonModel) { }
}
export class RemoveCrewMember {
  static readonly type = '[Crew] Remove a crew member';
  constructor(public payload: PersonModel) { }
}
