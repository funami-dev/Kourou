import { DOCUMENT, DestroyRef, Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';

import { AdvanceClock, GuiState } from '../../store';
import { CLOCK_TICK_INTERVAL_MS, MAX_REAL_MS_PER_TICK } from './clock.constants';

/**
 * Drives the game clock: measures how much real time has passed and lets the same amount pass in the game.
 *
 * Game time only advances while a game is running (a launch site is selected) and the browser tab is visible.
 * Elapsed time is measured instead of assuming a fixed tick length, because browsers do not fire timers precisely.
 */
@Injectable({ providedIn: 'root' })
export class GameClockDriver {
  private readonly store = inject(Store);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private lastTickAt = 0;

  start(): void {
    if (this.intervalId !== null) {
      return;
    }

    this.lastTickAt = performance.now();
    this.intervalId = setInterval(() => this.tick(), CLOCK_TICK_INTERVAL_MS);
    this.destroyRef.onDestroy(() => this.stop());
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick(): void {
    const now = performance.now();
    const realElapsedMs = Math.min(now - this.lastTickAt, MAX_REAL_MS_PER_TICK);
    this.lastTickAt = now;

    if (this.isGameRunning() && !this.document.hidden) {
      this.store.dispatch(new AdvanceClock(realElapsedMs));
    }
  }

  private isGameRunning(): boolean {
    return this.store.selectSnapshot(GuiState.getCurrentLocation) !== null;
  }
}
