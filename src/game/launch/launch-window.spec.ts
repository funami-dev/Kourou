import { LAUNCH_SITES } from '../launch-sites/launch-sites.constants';
import {
  canStartCountdownNow,
  isLaunchWindowOpen,
  launchWindowClosingMs,
  nextLaunchWindowOpeningMs
} from './launch-window';

const kourou = LAUNCH_SITES.kourou;
/** Real time for a local time in Kourou (UTC−3) on 13 November 2026. */
const kourouTime = (hour: number, minute = 0): number => Date.UTC(2026, 10, 13, hour + 3, minute);

describe('launch windows', () => {
  it('opens GTO launches in the evening', () => {
    expect(isLaunchWindowOpen(kourou, 'gto', kourouTime(15, 59))).toBe(false);
    expect(isLaunchWindowOpen(kourou, 'gto', kourouTime(16))).toBe(true);
    expect(isLaunchWindowOpen(kourou, 'gto', kourouTime(23, 59))).toBe(true);
  });

  it('handles windows that span midnight', () => {
    expect(isLaunchWindowOpen(kourou, 'sso', kourouTime(20))).toBe(true);
    expect(isLaunchWindowOpen(kourou, 'sso', kourouTime(2))).toBe(true);
    expect(isLaunchWindowOpen(kourou, 'sso', kourouTime(12))).toBe(false);
  });

  it('tells when a closed window opens next', () => {
    expect(nextLaunchWindowOpeningMs(kourou, 'gto', kourouTime(10))).toBe(kourouTime(16));
    expect(nextLaunchWindowOpeningMs(kourou, 'gto', kourouTime(17))).toBeNull();
  });

  it('tells when an open window closes', () => {
    expect(launchWindowClosingMs(kourou, 'leo', kourouTime(10))).toBe(kourouTime(22));
    expect(launchWindowClosingMs(kourou, 'sso', kourouTime(20))).toBe(kourouTime(30));
    expect(launchWindowClosingMs(kourou, 'gto', kourouTime(10))).toBeNull();
  });
});

describe('canStartCountdownNow', () => {
  it('requires the window to be open at liftoff, ten minutes from now', () => {
    expect(canStartCountdownNow(kourou, 'gto', kourouTime(15, 50))).toBe(true);
    expect(canStartCountdownNow(kourou, 'gto', kourouTime(15, 49))).toBe(false);
    expect(canStartCountdownNow(kourou, 'leo', kourouTime(21, 51))).toBe(false);
  });
});
