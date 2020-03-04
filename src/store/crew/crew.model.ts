export interface CrewModel {
  members: CrewMember[];
}

export enum CrewMember {
  NEU = 'NEU'
}
export interface CrewStateModel {
  members: CrewMemberModel[];
}
export interface CrewMemberModel {
  id: number;
  name: string;
  position: string;
}
