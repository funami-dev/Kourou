import { Component, OnInit, HostBinding } from '@angular/core';

import { RocketService } from './../../../../core/services/rocket.service';
import { RocketState } from '../../../../../interfaces/RocketState';
import { rotateTo, liftOff } from '../../../../core//animations/rocket';

@Component({
  selector: 'app-rocket',
  templateUrl: './rocket.component.html',
  styleUrls: ['./rocket.component.scss'],
  animations: [rotateTo, liftOff],
  styles: ['.rocket { transform: rotate(-45deg) perspective(0); transform: scale(1) }']
})
export class RocketComponent implements OnInit {
  isLiftOff = false;
  values: RocketState;
  constructor(public service: RocketService) {
    this.values = service.rocketInfo.value;
  }

  getRotate() {
    return `rotate(${this.values.angle}deg) perspective(0)`;
  }
  getScale() {
    return `scale(1)`;
  }

  ngOnInit() {}
}
