import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaRoutingModule, routingComponents } from './area-routing.module';

@NgModule({
  imports: [CommonModule, AreaRoutingModule],
  declarations: [routingComponents]
})
export class AreaModule {}
