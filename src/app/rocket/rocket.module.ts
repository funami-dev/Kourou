import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControllerService } from './controller.service';

import { RocketComponent } from './rocket/rocket.component';
import { RocketDashboardComponent } from './rocket-dashboard/rocket-dashboard.component';

@NgModule({
  imports: [CommonModule],
  declarations: [RocketComponent, RocketDashboardComponent],
  exports: [RocketComponent],
  providers: [ControllerService]
})
export class RocketModule {}
