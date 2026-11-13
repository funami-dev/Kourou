import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import { MS_PER_DAY, MS_PER_HOUR, MS_PER_MINUTE } from '../../../game/clock/clock.constants';
import { ClockState, GuiState, LaunchState, NEW_GAME_CLOCK, StaffState } from '../../../store';
import { GameClockComponent } from './game-clock.component';

describe('GameClockComponent', () => {
  let fixture: ComponentFixture<GameClockComponent>;
  let store: Store;

  const element = (): HTMLElement => fixture.nativeElement;
  const pauseButton = (): HTMLButtonElement => element().querySelector('button[mat-icon-button]')!;
  const speedButton = (speed: number): HTMLButtonElement =>
    element().querySelector(`button[aria-label="Spielgeschwindigkeit ${speed}-fach"]`)!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameClockComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore([ClockState, GuiState, LaunchState, StaffState])
      ]
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(GameClockComponent);
    await fixture.whenStable();
  });

  it('shows the game day and time of day', async () => {
    store.reset({
      ...store.snapshot(),
      clock: { ...NEW_GAME_CLOCK, gameTimeMs: 2 * MS_PER_DAY + 9 * MS_PER_HOUR + 5 * MS_PER_MINUTE }
    });
    await fixture.whenStable();

    expect(element().textContent).toContain('Tag 3 · 09:05');
  });

  it('pauses and resumes the game', async () => {
    pauseButton().click();
    await fixture.whenStable();
    expect(store.selectSnapshot(ClockState.isPaused)).toBe(true);
    expect(pauseButton().getAttribute('aria-label')).toBe('Spiel fortsetzen');

    pauseButton().click();
    await fixture.whenStable();
    expect(store.selectSnapshot(ClockState.isPaused)).toBe(false);
  });

  it('changes the game speed', async () => {
    speedButton(4).click();
    await fixture.whenStable();

    expect(store.selectSnapshot(ClockState.speed)).toBe(4);
    expect(speedButton(4).getAttribute('aria-pressed')).toBe('true');
  });
});
