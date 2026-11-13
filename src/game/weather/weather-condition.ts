import type { WeatherCondition } from './weather.model';

/**
 * Maps a WMO weather interpretation code to a simplified condition.
 * Code table: https://open-meteo.com/en/docs (section "WMO Weather interpretation codes").
 */
export function weatherConditionFromWmoCode(code: number): WeatherCondition {
  if (code <= 1) return 'clear';
  if (code === 2) return 'partlyCloudy';
  if (code === 3) return 'overcast';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95) return 'thunderstorm';

  // Unknown codes are treated as overcast: the most neutral condition.
  return 'overcast';
}
