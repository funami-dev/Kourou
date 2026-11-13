import { LAUNCH_SITES } from './launch-sites.constants';
import { localHourOfDay, localMonth, startOfLocalDayMs } from './local-time';

const kourou = LAUNCH_SITES.kourou;

describe('local time at a launch site', () => {
  // 1 March 2026, 02:30 UTC is still 28 February, 23:30 in Kourou (UTC−3).
  const lateEvening = Date.UTC(2026, 2, 1, 2, 30);

  it('knows the local month', () => {
    expect(localMonth(kourou, lateEvening)).toBe(2);
  });

  it('knows the local hour of day', () => {
    expect(localHourOfDay(kourou, lateEvening)).toBe(23.5);
  });

  it('finds the local midnight', () => {
    expect(startOfLocalDayMs(kourou, lateEvening)).toBe(Date.UTC(2026, 1, 28, 3, 0));
  });
});
