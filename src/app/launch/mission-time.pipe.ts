import { Pipe } from '@angular/core';
import type { PipeTransform } from '@angular/core';

const MS_PER_SECOND = 1000;

/** Formats mission time like a launch clock: "T−09:42" before liftoff, "T+01:10" after. */
@Pipe({ name: 'missionTime' })
export class MissionTimePipe implements PipeTransform {
  transform(missionTimeMs: number): string {
    const isBeforeLiftoff = missionTimeMs < 0;
    // Before liftoff the clock shows the remaining time, so partial seconds round up.
    const totalSeconds = isBeforeLiftoff
      ? Math.ceil(-missionTimeMs / MS_PER_SECOND)
      : Math.floor(missionTimeMs / MS_PER_SECOND);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `T${isBeforeLiftoff ? '−' : '+'}${padToTwoDigits(minutes)}:${padToTwoDigits(seconds)}`;
  }
}

function padToTwoDigits(value: number): string {
  return value.toString().padStart(2, '0');
}
