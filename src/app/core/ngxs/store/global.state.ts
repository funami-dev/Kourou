import { State, Action, Select, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';

export class SetLoadingStatus {
  static readonly type = '[Global] Toggle loading status';
  constructor(public isLoading: boolean) {}
}
export class AddCrewMember {
  static readonly type = '[Crew] Add a crew member';
  constructor(public payload) {}
}
export class RemoveCrewMember {
  static readonly type = '[Crew] Remove a crew member';
  constructor(public payload) {}
}
export class ToggleComplete {
  static readonly type = '[Global] Toggle complete';
}
export interface CrewStateModel {
  id: number;
  name: string;
  position: string;
}
export interface WeatherModel {
  temp: number;
}
export interface GlobalStateModel {
  isLoading: boolean;
  isCrewComplete: boolean;
  crew: CrewStateModel[];
  weather: WeatherModel;
}

@State<GlobalStateModel>({
  name: 'globalState',
  defaults: {
    isLoading: false,
    isCrewComplete: false,
    crew: [
      {
        id: 0,
        name: 'Alex',
        position: 'Commander'
      }
    ],
    weather: {
      temp: 9
    }
  }
})
export class GlobalState {
  constructor() {}

  @Select(GlobalState)
  globalState$: Observable<any[]>;

  @Action(AddCrewMember)
  AddCrewMember(ctx: StateContext<GlobalStateModel>, { payload }: AddCrewMember) {
    const state = ctx.getState();
    state.crew.push(payload);
    ctx.setState(state);
  }

  @Action(RemoveCrewMember)
  RemoveCrewMember(ctx: StateContext<GlobalStateModel>, { payload }: RemoveCrewMember) {
    const state = ctx.getState();
    state.crew = state.crew.filter(item => item.id !== payload);
    ctx.patchState(state);
  }

  @Action(SetLoadingStatus)
  setLoadingStatus(ctx: StateContext<GlobalStateModel>, action: SetLoadingStatus) {
    const state = ctx.getState();
    ctx.setState({ ...state, isLoading: action.isLoading });
  }

  @Action(ToggleComplete)
  toggleComplete(ctx: StateContext<GlobalStateModel>, action: ToggleComplete) {
    const state = ctx.getState();
    state.isCrewComplete = !state.isCrewComplete;
    ctx.patchState(state);
  }
}
