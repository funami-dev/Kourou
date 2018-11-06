import { State, Action, Select, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';

export class FillTank {
  static readonly type = '[Rocket] Fill tank';
}

export interface RocketState {
  fuel: number;
}

@State<RocketState>({
  name: 'RocketState',
  defaults: {
    fuel: 0
  }
})
export class RocketState {
  constructor() {}

  // SELECT

  // ACTIONS
}
