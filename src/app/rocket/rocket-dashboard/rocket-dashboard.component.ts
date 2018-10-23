import { Component, OnInit } from '@angular/core';
import { RocketService } from '../rocket/rocket.service';
import { RocketState } from '../../../interfaces/RocketState';

@Component({
  selector: 'app-rocket-dashboard',
  templateUrl: './rocket-dashboard.component.html',
  styleUrls: ['./rocket-dashboard.component.scss']
})
export class RocketDashboardComponent implements OnInit {
  values: RocketState;

  constructor(private service: RocketService) {
    this.values = service.rocketInfo.value;
  }

  ngOnInit() {}
}
