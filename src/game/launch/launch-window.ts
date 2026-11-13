import { MS_PER_HOUR } from '../clock/clock.constants';
import type { OrbitType } from '../contracts/contract.model';
import type { LaunchSite } from '../launch-sites/launch-site.model';
import { localHourOfDay, startOfLocalDayMs } from '../launch-sites/local-time';
import { COUNTDOWN_DURATION_MS, LAUNCH_WINDOWS } from './launch.constants';

/** Whether a launch to the orbit is possible at the given real time. Windows may span midnight. */
export function isLaunchWindowOpen(site: LaunchSite, orbit: OrbitType, epochMs: number): boolean {
  const { opensAtLocalHour, closesAtLocalHour } = LAUNCH_WINDOWS[orbit];
  const hour = localHourOfDay(site, epochMs);

  return opensAtLocalHour < closesAtLocalHour
    ? hour >= opensAtLocalHour && hour < closesAtLocalHour
    : hour >= opensAtLocalHour || hour < closesAtLocalHour;
}

/** The real time at which the launch window opens next, or `null` if it is open now. */
export function nextLaunchWindowOpeningMs(site: LaunchSite, orbit: OrbitType, nowMs: number): number | null {
  if (isLaunchWindowOpen(site, orbit, nowMs)) {
    return null;
  }

  const openingToday = startOfLocalDayMs(site, nowMs) + LAUNCH_WINDOWS[orbit].opensAtLocalHour * MS_PER_HOUR;
  return openingToday > nowMs ? openingToday : openingToday + 24 * MS_PER_HOUR;
}

/** The real time at which the currently open launch window closes, or `null` if it is closed. */
export function launchWindowClosingMs(site: LaunchSite, orbit: OrbitType, nowMs: number): number | null {
  if (!isLaunchWindowOpen(site, orbit, nowMs)) {
    return null;
  }

  const closingToday = startOfLocalDayMs(site, nowMs) + LAUNCH_WINDOWS[orbit].closesAtLocalHour * MS_PER_HOUR;
  return closingToday > nowMs ? closingToday : closingToday + 24 * MS_PER_HOUR;
}

/** Whether a countdown started now would reach liftoff inside the launch window (barring holds). */
export function canStartCountdownNow(site: LaunchSite, orbit: OrbitType, nowMs: number): boolean {
  return isLaunchWindowOpen(site, orbit, nowMs + COUNTDOWN_DURATION_MS);
}
