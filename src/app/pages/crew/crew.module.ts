import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrewRoutingModule, routingComponents } from './crew-routing/crew-routing.module';
import { TeamComponent } from './sections/team/team.component';
import { MarktComponent } from './sections/markt/markt.component';
import { CrewComponent } from './crew.component';

@NgModule({
  declarations: [routingComponents, TeamComponent, MarktComponent, CrewComponent],
  imports: [
    CommonModule,
    CrewRoutingModule
  ]
})
export class CrewModule { }
