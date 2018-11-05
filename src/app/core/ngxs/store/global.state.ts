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

export interface CrewModel {
  complete: boolean;
  members: CrewStateModel[];
}

export interface GlobalStateModel {
  isLoading: boolean;
  crew: CrewModel;
  weather: WeatherModel;
}

@State<GlobalStateModel>({
  name: 'globalState',
  defaults: {
    isLoading: false,
    crew: {
      complete: true,
      members: [
        {
          id: 0,
          name: 'Alex',
          position: 'Commanderaa'
        }
      ]
    },
    weather: {
      temp: 9
    }
  }
})
export class GlobalState {
  constructor() {}

  // TODO: IMPROVE
  @Select(GlobalState)
  globalState$: Observable<any[]>;

  @Action(AddCrewMember)
  AddCrewMember({ getState, setState }: StateContext<GlobalStateModel[]>, { payload }: AddCrewMember) {
    setState([...getState(), payload]);
  }

  @Action(RemoveCrewMember)
  RemoveCrewMember({ getState, setState }: StateContext<GlobalStateModel[]>, { payload }: RemoveCrewMember) {
    setState(getState('crew.members').filter(item => item.id !== payload));
  }

  @Action(SetLoadingStatus)
  setLoadingStatus(ctx: StateContext<GlobalStateModel>, action: SetLoadingStatus) {
    const state = ctx.getState();
    ctx.setState({ ...state, isLoading: action.isLoading });
  }

  @Action(ToggleComplete)
  toggleComplete(ctx: StateContext<GlobalStateModel>, action: ToggleComplete) {
    const state = ctx.getState();
    state.crew.complete = !state.crew.complete;
    ctx.patchState(state);
  }
}
