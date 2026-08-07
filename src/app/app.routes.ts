import { Routes } from '@angular/router';

import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { path: 'settings', component: SettingsComponent },
  {
    path: 'game',
    loadChildren: () => import('./area/area.routes').then(m => m.areaRoutes)
  }
];
