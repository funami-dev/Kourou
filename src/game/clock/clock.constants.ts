export const MS_PER_MINUTE = 60_000;
export const MS_PER_HOUR = 60 * MS_PER_MINUTE;
export const MS_PER_DAY = 24 * MS_PER_HOUR;

/** How long one in-game day lasts in real time at normal speed. See docs/game-design.md ("Spieltempo"). */
export const REAL_MINUTES_PER_GAME_DAY = 60;

/** Game time that passes per unit of real time at normal speed (one game day per real hour = 24). */
export const GAME_TIME_PER_REAL_TIME = MS_PER_DAY / (REAL_MINUTES_PER_GAME_DAY * MS_PER_MINUTE);

/** Speed multipliers the player can choose from. */
export const GAME_SPEEDS = [1, 2, 4] as const;
export type GameSpeed = (typeof GAME_SPEEDS)[number];

/** A new game starts on day 1 at 08:00, the beginning of a working day at the spaceport. */
export const NEW_GAME_START_HOUR = 8;

/** How often the clock advances. One game minute lasts 2.5 s at normal speed, so this keeps the display smooth. */
export const CLOCK_TICK_INTERVAL_MS = 500;

/**
 * Upper bound for the real time a single tick may process.
 * Protects against big jumps when the computer wakes from sleep or the browser throttled the timer:
 * the game should only advance while the player is actually watching.
 */
export const MAX_REAL_MS_PER_TICK = 2_000;
