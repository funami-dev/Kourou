import { LOCALE_ID, Pipe, inject } from '@angular/core';
import type { PipeTransform } from '@angular/core';

/** Formats a real point in time as the local clock time in the given time zone, e.g. "14:05". */
@Pipe({ name: 'siteLocalTime' })
export class SiteLocalTimePipe implements PipeTransform {
  private readonly locale = inject(LOCALE_ID);

  transform(epochMs: number, timeZone: string): string {
    return new Intl.DateTimeFormat(this.locale, {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).format(epochMs);
  }
}
