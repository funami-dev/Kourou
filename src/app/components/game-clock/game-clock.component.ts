import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { dispatch, select } from '@ngxs/store';

import { GAME_SPEEDS } from '../../../game/clock/clock.constants';
import type { GameSpeed } from '../../../game/clock/clock.constants';
import { toGameDateTime } from '../../../game/clock/game-time';
import { ClockState, PauseClock, ResumeClock, SetClockSpeed } from '../../../store';

/** Shows the current game time and lets the player pause the game or change its speed. */
@Component({
  selector: 'app-game-clock',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './game-clock.component.html',
  styleUrl: './game-clock.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameClockComponent {
  protected readonly gameSpeeds = GAME_SPEEDS;
  protected readonly isPaused = select(ClockState.isPaused);
  protected readonly speed = select(ClockState.speed);

  private readonly gameTimeMs = select(ClockState.gameTimeMs);
  protected readonly dateTime = computed(() => toGameDateTime(this.gameTimeMs()));
  protected readonly timeOfDay = computed(() => {
    const { hour, minute } = this.dateTime();
    return `${padToTwoDigits(hour)}:${padToTwoDigits(minute)}`;
  });

  private readonly pause = dispatch(PauseClock);
  private readonly resume = dispatch(ResumeClock);
  private readonly setSpeed = dispatch(SetClockSpeed);

  protected togglePause(): void {
    if (this.isPaused()) {
      this.resume();
    } else {
      this.pause();
    }
  }

  protected changeSpeed(speed: GameSpeed): void {
    this.setSpeed(speed);
  }
}

function padToTwoDigits(value: number): string {
  return value.toString().padStart(2, '0');
}
