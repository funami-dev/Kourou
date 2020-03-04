import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaRoutingModule } from './area-routing.module';
import { AreaComponent } from './area.component';
import { GroundComponent } from './ground/ground.component';

@NgModule({
  imports: [CommonModule, AreaRoutingModule],
  exports: [AreaComponent],
  declarations: [AreaComponent, GroundComponent],
  entryComponents: [AreaComponent, GroundComponent]
})
export class AreaModule {}
