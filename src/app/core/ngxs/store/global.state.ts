import { State, Action, Select, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';

export class SetLoadingStatus {
  static readonly type = '[Global] Toggle loading status';
  constructor(public isLoading: boolean) {}
}

export class ToggleComplete {
  static readonly type = '[Global] Toggle complete';
}

export interface WeatherModel {
  temp: number;
}

export interface CrewModel {
  complete: boolean;
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
      complete: true
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
