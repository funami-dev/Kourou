import { MS_PER_HOUR } from '../clock/clock.constants';
import type { LaunchSite } from '../launch-sites/launch-site.model';
import { localMonth, startOfLocalDayMs } from '../launch-sites/local-time';
import type { WeatherReport } from './weather.model';

/** Typical cloud cover and rain, by season. Rough values for a tropical coastal climate. */
const RAINY_SEASON = { condition: 'rain', cloudCoverPercent: 80, precipitationMillimeters: 0.5 } as const;
const DRY_SEASON = { condition: 'partlyCloudy', cloudCoverPercent: 40, precipitationMillimeters: 0 } as const;

/** Gusts are typically about one and a half times the mean wind speed. */
const TYPICAL_GUST_FACTOR = 1.5;

/**
 * Plausible weather for a launch site when live data is not available (e.g. offline).
 * Based on the site's typical climate and season, so the game can carry on sensibly.
 */
export function typicalWeather(site: LaunchSite, nowMs: number): WeatherReport {
  const { climate } = site;
  const season = climate.rainySeasonMonths.includes(localMonth(site, nowMs)) ? RAINY_SEASON : DRY_SEASON;
  const localMidnightMs = startOfLocalDayMs(site, nowMs);

  return {
    source: 'typical',
    observedAtMs: nowMs,
    condition: season.condition,
    temperatureCelsius: climate.typicalTemperatureCelsius,
    windSpeedMetersPerSecond: climate.typicalWindSpeedMetersPerSecond,
    windGustsMetersPerSecond: climate.typicalWindSpeedMetersPerSecond * TYPICAL_GUST_FACTOR,
    precipitationMillimeters: season.precipitationMillimeters,
    cloudCoverPercent: season.cloudCoverPercent,
    sunriseAtMs: localMidnightMs + climate.typicalSunriseHour * MS_PER_HOUR,
    sunsetAtMs: localMidnightMs + climate.typicalSunsetHour * MS_PER_HOUR
  };
}

/** Whether the sun is up at the given moment, according to the report's sunrise and sunset. */
export function isDaylight(report: WeatherReport, nowMs: number): boolean {
  return nowMs >= report.sunriseAtMs && nowMs < report.sunsetAtMs;
}
