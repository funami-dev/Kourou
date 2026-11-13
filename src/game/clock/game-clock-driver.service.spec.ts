import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import { ClockState, GuiState, NEW_GAME_CLOCK } from '../../store';
import { CLOCK_TICK_INTERVAL_MS, MAX_REAL_MS_PER_TICK, MS_PER_MINUTE } from './clock.constants';
import { realToGameDuration } from './game-time';
import { GameClockDriver } from './game-clock-driver.service';

describe('GameClockDriver', () => {
  let store: Store;
  let driver: GameClockDriver;

  const elapsedGameTime = (): number => store.selectSnapshot(ClockState.gameTimeMs) - NEW_GAME_CLOCK.gameTimeMs;

  const startGameAtKourou = (): void => store.reset({ ...store.snapshot(), gui: { currentLocation: 'kourou' } });

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'performance'] });

    TestBed.configureTestingModule({ providers: [provideRouter([]), provideStore([ClockState, GuiState])] });
    store = TestBed.inject(Store);
    driver = TestBed.inject(GameClockDriver);
  });

  afterEach(() => {
    driver.stop();
    vi.useRealTimers();
  });

  it('lets game time pass while a game is running', () => {
    startGameAtKourou();
    driver.start();

    vi.advanceTimersByTime(5_000);

    expect(elapsedGameTime()).toBe(2 * MS_PER_MINUTE);
  });

  it('does not let game time pass before a launch site is selected', () => {
    driver.start();

    vi.advanceTimersByTime(5_000);

    expect(elapsedGameTime()).toBe(0);
  });

  it('caps a single tick so that a long interruption does not skip game time', () => {
    startGameAtKourou();
    driver.start();

    // Simulates a computer waking from sleep: an hour has passed before the next tick fires.
    vi.spyOn(performance, 'now').mockReturnValue(performance.now() + 60 * MS_PER_MINUTE);
    vi.advanceTimersByTime(CLOCK_TICK_INTERVAL_MS);

    expect(elapsedGameTime()).toBe(realToGameDuration(MAX_REAL_MS_PER_TICK, 1));
  });
});
