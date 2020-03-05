import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AreaRoutingModule } from './area/area-routing.module';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'settings', component: SettingsComponent },
  {
    path: 'game',
    loadChildren: () => AreaRoutingModule
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
  declarations: [SettingsComponent]
})
export class AppRoutingModule {}

export const routingComponents = [];
