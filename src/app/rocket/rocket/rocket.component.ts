import { Component, OnInit } from '@angular/core';

import { RocketService } from './rocket.service';
import { RocketState } from '../../../interfaces/RocketState';

@Component({
  selector: 'app-rocket',
  templateUrl: './rocket.component.html',
  styleUrls: ['./rocket.component.scss']
})
export class RocketComponent implements OnInit {
  values: RocketState;

  constructor(public service: RocketService) {
    this.values = service.rocketInfo.value;
  }

  ngOnInit() {}

  public setRocketInfo() {
    this.service.setRocketInfo(this.values);
  }
}
