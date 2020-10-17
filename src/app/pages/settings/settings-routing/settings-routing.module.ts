import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './../settings.component';
import { GameComponent } from '../sections/game/game.component';

export const routes: Routes = [
  // { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: SettingsComponent },
  { path: '/game', component: GameComponent }
];

@NgModule({
  declarations: [GameComponent],
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]

})
export class SettingsRoutingModule { }

export const routingComponents = [];
