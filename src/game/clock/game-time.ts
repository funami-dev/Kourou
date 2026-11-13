import { GAME_TIME_PER_REAL_TIME, MS_PER_DAY, MS_PER_HOUR, MS_PER_MINUTE } from './clock.constants';
import type { GameSpeed } from './clock.constants';

/** A point in game time, broken down for display. Days start at 1. */
export interface GameDateTime {
  day: number;
  hour: number;
  minute: number;
}

/** Converts a span of real time into the span of game time that passes during it. */
export function realToGameDuration(realDurationMs: number, speed: GameSpeed): number {
  return realDurationMs * GAME_TIME_PER_REAL_TIME * speed;
}

/**
 * Breaks game time down into day, hour and minute.
 *
 * @param gameTimeMs milliseconds since the start of day 1 (00:00)
 */
export function toGameDateTime(gameTimeMs: number): GameDateTime {
  const timeOfDayMs = gameTimeMs % MS_PER_DAY;

  return {
    day: Math.floor(gameTimeMs / MS_PER_DAY) + 1,
    hour: Math.floor(timeOfDayMs / MS_PER_HOUR),
    minute: Math.floor((timeOfDayMs % MS_PER_HOUR) / MS_PER_MINUTE)
  };
}
