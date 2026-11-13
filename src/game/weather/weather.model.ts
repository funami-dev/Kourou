/** Simplified weather situation, derived from the WMO weather code. */
export type WeatherCondition =
  | 'clear'
  | 'partlyCloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm';

/**
 * Where the weather data comes from:
 * live data from the weather service, or typical values for the site when no live data is available.
 */
export type WeatherSource = 'live' | 'typical';

/** Current weather at a launch site. All points in time are real time (Unix epoch milliseconds). */
export interface WeatherReport {
  source: WeatherSource;
  observedAtMs: number;
  condition: WeatherCondition;
  temperatureCelsius: number;
  windSpeedMetersPerSecond: number;
  windGustsMetersPerSecond: number;
  precipitationMillimeters: number;
  cloudCoverPercent: number;
  sunriseAtMs: number;
  sunsetAtMs: number;
}
