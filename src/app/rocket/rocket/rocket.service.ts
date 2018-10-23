import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { RocketState } from '../../../interfaces/RocketState';

@Injectable({
  providedIn: 'root'
})
export class RocketService {
  public rocketInfo = new BehaviorSubject<RocketState>({ speed: 0, angle: 90 });

  constructor() {}

  public setRocketInfo(payload) {
    this.rocketInfo.next({ ...this.rocketInfo.value, ...payload });
  }
}
