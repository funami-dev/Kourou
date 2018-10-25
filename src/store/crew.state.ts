import { Action, StateContext, State } from '@ngxs/store';
import { AddCrewMember, RemoveCrewMember } from './crew.actions';

export interface CrewStateModel {
  id: number;
  name: string;
  position: string;
}
@State<CrewStateModel[]>({
  name: 'crew',
  defaults: [
    {
      id: 0,
      name: 'Alex',
      position: 'Commander'
    }
  ]
})
export class CrewState {
  @Action(AddCrewMember)
  AddCrewMember({ getState, setState }: StateContext<CrewStateModel[]>, { payload }: AddCrewMember) {
    setState([...getState(), payload]);
  }

  @Action(RemoveCrewMember)
  RemoveCrewMember({ getState, setState }: StateContext<CrewStateModel[]>, { payload }: RemoveCrewMember) {
    setState(getState().filter(item => item.id !== payload));
  }
}
