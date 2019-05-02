import { Component, OnInit } from '@angular/core';

import { RocketService } from './../../../../core/services/rocket.service';
import { RocketState } from '../../../../../interfaces/RocketState';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.scss']
})
export class CommandsComponent implements OnInit {
  values: RocketState;
  constructor(public service: RocketService) {
    this.values = service.rocketInfo.value;
  }
  ngOnInit() {}

  public setRocketInfo() {
    this.service.setRocketInfo(this.values);
  }
}
