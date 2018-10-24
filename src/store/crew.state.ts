import { Action, StateContext, State } from '@ngxs/store';
import { AddCrewMember } from './crew.actions';

export interface CrewStateModel {
  name: string;
}

@State<CrewStateModel>({
  name: 'crew',
  defaults: {
    name: 'Alex'
  }
})
export class CrewState {
  @Action(AddCrewMember)
  crewStateModel({ patchState }: StateContext<CrewStateModel>, { payload }: AddCrewMember) {
    patchState({ name: payload });
  }
}
