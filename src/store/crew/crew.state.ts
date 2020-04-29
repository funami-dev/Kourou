import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { CrewStateModel, CrewMemberModel } from './crew.model';
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
@Injectable()
export class CrewState {
  @Selector()
  static getCrew(state: CrewStateModel): CrewMemberModel[] {
    console.log({ state });
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
