import { MS_PER_HOUR } from '../clock/clock.constants';
import { LAUNCH_SITES } from '../launch-sites/launch-sites.constants';
import { isDaylight, typicalWeather } from './typical-weather';

const kourou = LAUNCH_SITES.kourou;

describe('typicalWeather', () => {
  it('is rainy in the rainy season', () => {
    // 15 March, 12:00 local time in Kourou (UTC−3).
    const report = typicalWeather(kourou, Date.UTC(2026, 2, 15, 15, 0));

    expect(report.source).toBe('typical');
    expect(report.condition).toBe('rain');
  });

  it('is mostly dry in the dry season', () => {
    // 15 September, 12:00 local time in Kourou.
    expect(typicalWeather(kourou, Date.UTC(2026, 8, 15, 15, 0)).condition).toBe('partlyCloudy');
  });

  it('places sunrise and sunset on the local day', () => {
    const report = typicalWeather(kourou, Date.UTC(2026, 8, 15, 15, 0));

    // Kourou is UTC−3: local midnight on 15 September is 03:00 UTC.
    const localMidnight = Date.UTC(2026, 8, 15, 3, 0);
    expect(report.sunriseAtMs).toBe(localMidnight + kourou.climate.typicalSunriseHour * MS_PER_HOUR);
    expect(report.sunsetAtMs).toBe(localMidnight + kourou.climate.typicalSunsetHour * MS_PER_HOUR);
  });
});

describe('isDaylight', () => {
  const report = typicalWeather(kourou, Date.UTC(2026, 8, 15, 15, 0));

  it('is daylight between sunrise and sunset', () => {
    expect(isDaylight(report, report.sunriseAtMs)).toBe(true);
    expect(isDaylight(report, report.sunsetAtMs - 1)).toBe(true);
  });

  it('is night before sunrise and after sunset', () => {
    expect(isDaylight(report, report.sunriseAtMs - 1)).toBe(false);
    expect(isDaylight(report, report.sunsetAtMs)).toBe(false);
  });
});
