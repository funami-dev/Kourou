import type { GameSpeed } from '../../game/clock/clock.constants';

export interface ClockStateModel {
  /** Milliseconds of game time since the start of day 1 (00:00). */
  gameTimeMs: number;
  isPaused: boolean;
  /** Kept while paused, so resuming continues at the previous speed. */
  speed: GameSpeed;
}
