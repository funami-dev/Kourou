import { Injectable } from '@angular/core';
import { Action, Selector, State } from '@ngxs/store';
import type { StateContext } from '@ngxs/store';

import { MS_PER_HOUR, NEW_GAME_START_HOUR } from '../../game/clock/clock.constants';
import type { GameSpeed } from '../../game/clock/clock.constants';
import { realToGameDuration } from '../../game/clock/game-time';
import type { ClockStateModel } from './clock.model';
import { AdvanceClock, PauseClock, ResumeClock, SetClockSpeed } from './clock.actions';

export const NEW_GAME_CLOCK: ClockStateModel = {
  gameTimeMs: NEW_GAME_START_HOUR * MS_PER_HOUR,
  isPaused: false,
  speed: 1
};

@State<ClockStateModel>({
  name: 'clock',
  defaults: NEW_GAME_CLOCK
})
@Injectable()
export class ClockState {
  @Selector()
  static gameTimeMs(state: ClockStateModel): number {
    return state.gameTimeMs;
  }

  @Selector()
  static isPaused(state: ClockStateModel): boolean {
    return state.isPaused;
  }

  @Selector()
  static speed(state: ClockStateModel): GameSpeed {
    return state.speed;
  }

  @Action(AdvanceClock)
  advance(ctx: StateContext<ClockStateModel>, { realElapsedMs }: AdvanceClock): void {
    const { gameTimeMs, isPaused, speed } = ctx.getState();
    if (isPaused) {
      return;
    }

    ctx.patchState({ gameTimeMs: gameTimeMs + realToGameDuration(realElapsedMs, speed) });
  }

  @Action(PauseClock)
  pause(ctx: StateContext<ClockStateModel>): void {
    ctx.patchState({ isPaused: true });
  }

  @Action(ResumeClock)
  resume(ctx: StateContext<ClockStateModel>): void {
    ctx.patchState({ isPaused: false });
  }

  @Action(SetClockSpeed)
  setSpeed(ctx: StateContext<ClockStateModel>, { speed }: SetClockSpeed): void {
    ctx.patchState({ speed });
  }
}
