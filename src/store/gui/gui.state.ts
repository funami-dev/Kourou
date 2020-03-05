import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Router } from '@angular/router';

import { GuiStateModel } from './gui.model';
import { SetCurrentLocation } from './gui.actions';

@State<GuiStateModel>({
  name: 'gui',
  defaults: {
    currentLocation: null
  }
})
export class GuiState {
  @Selector()
  static getCurrentLocation(state: GuiStateModel): string {
    return state.currentLocation;
  }

  constructor(private router: Router) {}

  @Action(SetCurrentLocation)
  SetCurrentLocation({ getState, setState }: StateContext<GuiStateModel>, { id }: SetCurrentLocation) {
    console.log(id);
    setState({ ...getState(), currentLocation: id });
    if (id) {
      this.router.navigate(['/area']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
