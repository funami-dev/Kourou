import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../controller.service';

@Component({
  selector: 'app-rocket-dashboard',
  templateUrl: './rocket-dashboard.component.html',
  styleUrls: ['./rocket-dashboard.component.scss']
})
export class RocketDashboardComponent implements OnInit {
  constructor(private controllerService: ControllerService) {}
  angle = 0;

  getWeatherData(): void {
    this.angle = this.controllerService.getAngle();
  }

  ngOnInit() {
    this.getWeatherData();
  }
}
