import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngxs/store';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';

import { environment } from '../environments/environment';
import { GameLoop } from '../game/game-loop.service';
import {
  BuildingsState,
  ClockState,
  ContractsState,
  FinanceState,
  GuiState,
  LaunchState,
  ReputationState,
  ResearchContractsState,
  ResearchState,
  RocketsState,
  StaffState
} from '../store';
import { completeSavedGame } from '../store/saved-game';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideStore(
      [
        BuildingsState,
        ClockState,
        ContractsState,
        FinanceState,
        GuiState,
        LaunchState,
        ReputationState,
        ResearchContractsState,
        ResearchState,
        RocketsState,
        StaffState
      ],
      { developmentMode: !environment.production },
      withNgxsStoragePlugin({ keys: '*', afterDeserialize: completeSavedGame }),
      withNgxsReduxDevtoolsPlugin({ disabled: environment.production })
    ),
    provideAppInitializer(() => inject(GameLoop).start())
  ]
};
