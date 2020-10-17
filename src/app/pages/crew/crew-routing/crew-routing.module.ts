import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarktComponent } from './../sections/markt/markt.component';
import { TeamComponent } from './../sections/team/team.component';

export const routes: Routes = [
  { path: '', redirectTo: 'team', pathMatch: 'full'},
  { path: 'team', component: TeamComponent , data: { label: 'Team'} },
  { path: 'markt', component: MarktComponent, data: { label: 'Markt'} }
];

@NgModule({
  declarations: [MarktComponent, TeamComponent],
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class CrewRoutingModule {}

export const routingComponents = [];
