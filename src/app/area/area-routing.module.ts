import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AreaComponent } from './area.component';
import { GroundComponent } from './ground/ground.component';

export const routes: Routes = [
  // { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'area', component: AreaComponent },
  { path: 'ground', component: GroundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, GroundComponent],
  declarations: [AreaComponent, GroundComponent]
})
export class AreaRoutingModule {}

export const routingComponents = [AreaComponent];
