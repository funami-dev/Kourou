import { Injectable } from '@angular/core';
import { Action, Selector, State } from '@ngxs/store';
import type { StateContext } from '@ngxs/store';

import type { CrewStateModel, CrewMemberModel } from './crew.model';
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
    return state.members;
  }

  @Selector()
  static getState(state: CrewStateModel): CrewStateModel {
    return state;
  }

  @Action(AddCrewMember)
  addCrewMember(ctx: StateContext<CrewStateModel>, { payload }: AddCrewMember): void {
    ctx.patchState({ members: [...ctx.getState().members, payload] });
  }

  @Action(RemoveCrewMember)
  removeCrewMember(ctx: StateContext<CrewStateModel>, { payload }: RemoveCrewMember): void {
    ctx.patchState({ members: ctx.getState().members.filter(item => item.id !== payload) });
  }
}
