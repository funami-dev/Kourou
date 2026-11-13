import type { OpenMeteoForecastResponse } from './open-meteo';

/** Shape of a real Open-Meteo response (shortened), with Unix timestamps in seconds. */
export const SAMPLE_OPEN_METEO_RESPONSE: OpenMeteoForecastResponse = {
  current: {
    time: 1_794_560_400,
    temperature_2m: 28.4,
    precipitation: 0.2,
    cloud_cover: 63,
    wind_speed_10m: 4.6,
    wind_gusts_10m: 9.1,
    weather_code: 80
  },
  daily: {
    sunrise: [1_794_538_020],
    sunset: [1_794_581_640]
  }
};
