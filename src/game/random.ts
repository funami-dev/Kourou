import { Injectable } from '@angular/core';

/** Returns a random number in [0, 1), like `Math.random`. */
export type RandomNumberGenerator = () => number;

/**
 * Source of randomness for the game.
 * Injected instead of calling `Math.random` directly, so tests can replace it with predictable numbers.
 */
@Injectable({ providedIn: 'root' })
export class RandomSource {
  readonly next: RandomNumberGenerator = () => Math.random();
}

/** Random whole number between `min` and `max`, both included. */
export function randomIntegerBetween(random: RandomNumberGenerator, min: number, max: number): number {
  return min + Math.floor(random() * (max - min + 1));
}

export function pickRandom<T>(random: RandomNumberGenerator, items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error('Cannot pick a random item from an empty list.');
  }
  return items[randomIntegerBetween(random, 0, items.length - 1)]!;
}
