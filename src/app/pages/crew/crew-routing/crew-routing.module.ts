import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { TeamComponent } from '../sections/team/team.component';
import { MarktComponent } from './../sections/markt/markt.component';
import { MaterialModule } from 'src/app/material/material.module';

export const routes: Routes = [
  { path: '', redirectTo: 'team', pathMatch: 'full' },
  { path: 'team', component: TeamComponent, data: { label: 'Team' } },
  { path: 'markt', component: MarktComponent, data: { label: 'Markt' } }
];

@NgModule({
  declarations: [MarktComponent, TeamComponent],
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes), CommonModule,
    MaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrewRoutingModule { }

export const routingComponents = [];
