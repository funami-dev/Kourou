import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import { ClockState, GuiState, LaunchState, NEW_GAME_CLOCK, NEW_GAME_LAUNCH } from '../store';
import { createCountdown } from './launch/countdown';
import { CLOCK_TICK_INTERVAL_MS, MAX_REAL_MS_PER_TICK, MS_PER_MINUTE } from './clock/clock.constants';
import { realToGameDuration } from './clock/game-time';
import { GameLoop } from './game-loop.service';

describe('GameLoop', () => {
  let store: Store;
  let gameLoop: GameLoop;

  const elapsedGameTime = (): number => store.selectSnapshot(ClockState.gameTimeMs) - NEW_GAME_CLOCK.gameTimeMs;

  const startGameAtKourou = (): void => store.reset({ ...store.snapshot(), gui: { currentLocation: 'kourou' } });

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'performance'] });

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore([ClockState, GuiState, LaunchState])
      ]
    });
    store = TestBed.inject(Store);
    gameLoop = TestBed.inject(GameLoop);
  });

  afterEach(() => {
    gameLoop.stop();
    vi.useRealTimers();
  });

  it('lets game time pass while a game is running', () => {
    startGameAtKourou();
    gameLoop.start();

    vi.advanceTimersByTime(5_000);

    expect(elapsedGameTime()).toBe(2 * MS_PER_MINUTE);
  });

  it('does not let game time pass before a launch site is selected', () => {
    gameLoop.start();

    vi.advanceTimersByTime(5_000);

    expect(elapsedGameTime()).toBe(0);
  });

  it('caps a single tick so that a long interruption does not skip game time', () => {
    startGameAtKourou();
    gameLoop.start();

    // Simulates a computer waking from sleep: an hour has passed before the next tick fires.
    vi.spyOn(performance, 'now').mockReturnValue(performance.now() + 60 * MS_PER_MINUTE);
    vi.advanceTimersByTime(CLOCK_TICK_INTERVAL_MS);

    expect(elapsedGameTime()).toBe(realToGameDuration(MAX_REAL_MS_PER_TICK, 1));
  });

  it('runs the countdown instead of game time while the countdown is open', () => {
    startGameAtKourou();
    const countdown = createCountdown(
      { campaign: { contractId: 1, rocketId: 1 }, rocketModelId: 'ibis', targetOrbit: 'leo' },
      () => 0
    );
    store.reset({ ...store.snapshot(), launch: { ...NEW_GAME_LAUNCH, countdown } });
    gameLoop.start();

    vi.advanceTimersByTime(5_000);

    expect(elapsedGameTime()).toBe(0);
    expect(store.selectSnapshot(LaunchState.countdown)?.missionTimeMs).toBe(countdown.missionTimeMs + 5_000);
  });
});
