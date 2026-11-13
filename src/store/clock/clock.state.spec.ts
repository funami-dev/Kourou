import { TestBed } from '@angular/core/testing';
import { Store, provideStore } from '@ngxs/store';

import { MS_PER_MINUTE } from '../../game/clock/clock.constants';
import { AdvanceClock, PauseClock, ResumeClock, SetClockSpeed } from './clock.actions';
import { ClockState, NEW_GAME_CLOCK } from './clock.state';

describe('ClockState', () => {
  let store: Store;

  const gameTime = (): number => store.selectSnapshot(ClockState.gameTimeMs);

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideStore([ClockState])] });
    store = TestBed.inject(Store);
  });

  it('starts a new game in the morning of day 1, running at normal speed', () => {
    expect(store.selectSnapshot(ClockState.gameTimeMs)).toBe(NEW_GAME_CLOCK.gameTimeMs);
    expect(store.selectSnapshot(ClockState.isPaused)).toBe(false);
    expect(store.selectSnapshot(ClockState.speed)).toBe(1);
  });

  it('advances game time for the elapsed real time', () => {
    store.dispatch(new AdvanceClock(2_500));

    expect(gameTime()).toBe(NEW_GAME_CLOCK.gameTimeMs + MS_PER_MINUTE);
  });

  it('advances faster at a higher speed', () => {
    store.dispatch(new SetClockSpeed(4));
    store.dispatch(new AdvanceClock(2_500));

    expect(gameTime()).toBe(NEW_GAME_CLOCK.gameTimeMs + 4 * MS_PER_MINUTE);
  });

  it('does not advance while paused', () => {
    store.dispatch(new PauseClock());
    store.dispatch(new AdvanceClock(2_500));

    expect(gameTime()).toBe(NEW_GAME_CLOCK.gameTimeMs);
  });

  it('keeps the chosen speed across pause and resume', () => {
    store.dispatch([new SetClockSpeed(2), new PauseClock(), new ResumeClock()]);

    expect(store.selectSnapshot(ClockState.isPaused)).toBe(false);
    expect(store.selectSnapshot(ClockState.speed)).toBe(2);
  });
});
