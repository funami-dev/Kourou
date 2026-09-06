import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Selector, State } from '@ngxs/store';
import type { StateContext } from '@ngxs/store';

import type { GuiStateModel } from './gui.model';
import { SetCurrentLocation } from './gui.actions';

@State<GuiStateModel>({
  name: 'gui',
  defaults: {
    currentLocation: null
  }
})
@Injectable()
export class GuiState {
  @Selector()
  static getCurrentLocation(state: GuiStateModel): string | null {
    return state.currentLocation;
  }

  private readonly router = inject(Router);

  @Action(SetCurrentLocation)
  setCurrentLocation(ctx: StateContext<GuiStateModel>, { id }: SetCurrentLocation): void {
    ctx.patchState({ currentLocation: id });
    void this.router.navigate([id ? '/game/area' : '/']);
  }
}
