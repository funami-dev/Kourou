import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, provideStore } from '@ngxs/store';

import { MS_PER_DAY, MS_PER_HOUR, MS_PER_MINUTE } from '../../../game/clock/clock.constants';
import { ClockState, NEW_GAME_CLOCK } from '../../../store';
import { GameClockComponent } from './game-clock.component';

describe('GameClockComponent', () => {
  let fixture: ComponentFixture<GameClockComponent>;
  let store: Store;

  const element = (): HTMLElement => fixture.nativeElement;
  const pauseButton = (): HTMLButtonElement => element().querySelector('button[mat-icon-button]')!;
  const speedButton = (label: string): HTMLButtonElement =>
    element().querySelector(`button[aria-label="Game speed ${label}"]`)!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameClockComponent],
      providers: [provideStore([ClockState])]
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(GameClockComponent);
    await fixture.whenStable();
  });

  it('shows the game day and time of day', async () => {
    store.reset({ clock: { ...NEW_GAME_CLOCK, gameTimeMs: 2 * MS_PER_DAY + 9 * MS_PER_HOUR + 5 * MS_PER_MINUTE } });
    await fixture.whenStable();

    expect(element().textContent).toContain('Day 3 · 09:05');
  });

  it('pauses and resumes the game', async () => {
    pauseButton().click();
    await fixture.whenStable();
    expect(store.selectSnapshot(ClockState.isPaused)).toBe(true);
    expect(pauseButton().getAttribute('aria-label')).toBe('Resume game');

    pauseButton().click();
    await fixture.whenStable();
    expect(store.selectSnapshot(ClockState.isPaused)).toBe(false);
  });

  it('changes the game speed', async () => {
    speedButton('4x').click();
    await fixture.whenStable();

    expect(store.selectSnapshot(ClockState.speed)).toBe(4);
    expect(speedButton('4x').getAttribute('aria-pressed')).toBe('true');
  });
});
