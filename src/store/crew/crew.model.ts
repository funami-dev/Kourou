export interface CrewModel {
  members: CrewMember[];
}

export enum CrewMember {
  NEU = 'NEU'
}
export interface CrewStateModel {
  message: String;
  members: CrewMemberModel[];
  talents: TalentMemberModel[];
}
export interface CrewMemberModel {
  id: string;
  name: string;
  position: string;
}

export interface TalentMemberModel {
  id: string;
  name: string;
  position: string;
}

export interface PersonModel {
  id: string;
  name: string;
  position: string;
}
