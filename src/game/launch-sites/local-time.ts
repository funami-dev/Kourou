import { MS_PER_HOUR } from '../clock/clock.constants';
import type { LaunchSite } from './launch-site.model';

/** Local calendar month (1–12) at the site. */
export function localMonth(site: LaunchSite, epochMs: number): number {
  return localDateParts(site, epochMs).month;
}

/** Local time of day at the site in hours, e.g. 14.5 for 14:30. */
export function localHourOfDay(site: LaunchSite, epochMs: number): number {
  return (epochMs - startOfLocalDayMs(site, epochMs)) / MS_PER_HOUR;
}

/** Real time (epoch ms) of the most recent local midnight at the site. */
export function startOfLocalDayMs(site: LaunchSite, epochMs: number): number {
  const { hour, minute, second } = localDateParts(site, epochMs);
  const msSinceLocalMidnight = ((hour * 60 + minute) * 60 + second) * 1000 + (epochMs % 1000);
  return epochMs - msSinceLocalMidnight;
}

function localDateParts(site: LaunchSite, epochMs: number): Record<'month' | 'hour' | 'minute' | 'second', number> {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: site.timeZone,
    month: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23'
  }).formatToParts(epochMs);
  const partValue = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    month: partValue('month'),
    hour: partValue('hour'),
    minute: partValue('minute'),
    second: partValue('second')
  };
}
