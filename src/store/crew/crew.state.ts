import { CrewStateModel, CrewMemberModel } from './crew.model';
import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';

import { AddCrewMember, RemoveCrewMember } from './crew.actions';

@State<CrewStateModel>({
  name: 'crew',
  defaults: {
    members: [
      {
        id: 0,
        name: 'Alex',
        position: 'Commander'
      }
    ]
  }
})
export class CrewState {
  @Selector()
  static getCrew(state: CrewStateModel): CrewMemberModel[] {
    return state.members;
  }

  @Selector()
  public static getState(state: CrewStateModel) {
    return state;
  }

  @Action(AddCrewMember)
  AddCrewMember({ getState, setState }: StateContext<CrewMemberModel[]>, { payload }: AddCrewMember) {
    setState([...getState(), payload]);
  }

  @Action(RemoveCrewMember)
  RemoveCrewMember({ getState, setState }: StateContext<CrewMemberModel[]>, { payload }: RemoveCrewMember) {
    setState(getState().filter(item => item.id !== payload));
  }
}
