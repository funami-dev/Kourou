import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { CrewStateModel, PersonModel } from './crew.model';
import { AddCrewMember, RemoveCrewMember } from './crew.actions';

@State<CrewStateModel>({
  name: 'crew',
  defaults: {
    message: 'just contetn for module',
    talents: [
      {
        id: 'fnjkfnsfdf-nfndsjfndsjfndskfs',
        name: 'Frank',
        position: 'Commander'
      }
    ],
    members: [
      {
        id: 'dweerk4t435-34543g-rg-43g-3',
        name: 'Alex',
        position: 'Commander'
      }
    ]
  }
})
@Injectable()
export class CrewState {
  @Selector()
  static getCrew(state: CrewStateModel): PersonModel[] {
    return state.members;
  }
  @Selector()
  static getTalents(state: CrewStateModel): PersonModel[] {
    return state.talents;
  }

  @Selector()
  public static getState(state: CrewStateModel) {
    return state;
  }

  @Action(AddCrewMember)
  AddCrewMember({ getState, patchState }: StateContext<CrewStateModel>, { payload }: AddCrewMember) {
    const state = getState();
    const newState = state.talents.filter(el => el.id !== payload.id);
    patchState({
      talents: newState
    });
    patchState({
      members: [
        ...state.members,
        payload
      ]
    });
  }

  @Action(RemoveCrewMember)
  RemoveCrewMember({ getState, setState, patchState }: StateContext<CrewStateModel>, { payload }: RemoveCrewMember) {
    const state = getState();
    const newState = state.members.filter(el => el.id !== payload.id);
    patchState({
      members: newState
    });
    patchState({
      talents: [
        ...state.talents,
        payload
      ]
    });
  }
}
