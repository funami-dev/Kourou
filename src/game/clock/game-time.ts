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

/**
 * Lists the game days that began within a span of game time, so day-based rules (like daily costs) apply
 * exactly once per day, even if one clock tick spans several days.
 *
 * @returns 1-based day numbers that start after `fromGameTimeMs` and no later than `toGameTimeMs`
 */
export function daysStartedBetween(fromGameTimeMs: number, toGameTimeMs: number): number[] {
  const firstNewDay = toGameDateTime(fromGameTimeMs).day + 1;
  const lastNewDay = toGameDateTime(toGameTimeMs).day;

  return Array.from({ length: Math.max(0, lastNewDay - firstNewDay + 1) }, (_, index) => firstNewDay + index);
}

/** Game time at which the given 1-based day begins. */
export function startOfGameDay(day: number): number {
  return (day - 1) * MS_PER_DAY;
}
