import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngxs/store';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';

import { environment } from '../environments/environment';
import { CrewState, GuiState } from '../store';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideStore(
      [CrewState, GuiState],
      { developmentMode: !environment.production },
      withNgxsStoragePlugin({ keys: '*' }),
      withNgxsReduxDevtoolsPlugin({ disabled: environment.production })
    )
  ]
};
