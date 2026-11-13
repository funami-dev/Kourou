import { Pipe } from '@angular/core';
import type { PipeTransform } from '@angular/core';

import { toGameDateTime } from '../../game/clock/game-time';

/** Formats game time for display, e.g. "Tag 3 · 09:05". */
@Pipe({ name: 'gameDateTime' })
export class GameDateTimePipe implements PipeTransform {
  transform(gameTimeMs: number): string {
    const { day, hour, minute } = toGameDateTime(gameTimeMs);
    const timeOfDay = `${padToTwoDigits(hour)}:${padToTwoDigits(minute)}`;

    return $localize`:@@gameDateTime:Tag ${day}:day: · ${timeOfDay}:timeOfDay:`;
  }
}

function padToTwoDigits(value: number): string {
  return value.toString().padStart(2, '0');
}
