import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrewRoutingModule, routingComponents } from './crew-routing/crew-routing.module';
import { CrewComponent } from './crew.component';

@NgModule({
  declarations: [routingComponents, CrewComponent],
  imports: [
    CommonModule,
    CrewRoutingModule
  ],
})
export class CrewModule { }
