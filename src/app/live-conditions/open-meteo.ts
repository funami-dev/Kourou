import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import type { Observable } from 'rxjs';

import type { LaunchSite } from '../../game/launch-sites/launch-site.model';
import { weatherConditionFromWmoCode } from '../../game/weather/weather-condition';
import type { WeatherReport } from '../../game/weather/weather.model';

/** Free weather API without API key. Data is licensed under CC BY 4.0 and must be attributed. */
export const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
export const OPEN_METEO_ATTRIBUTION_URL = 'https://open-meteo.com/';

/** The part of the Open-Meteo forecast response the game uses. Times are Unix timestamps in seconds. */
export interface OpenMeteoForecastResponse {
  current: {
    time: number;
    temperature_2m: number;
    precipitation: number;
    cloud_cover: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    weather_code: number;
  };
  daily: {
    sunrise: number[];
    sunset: number[];
  };
}

const MS_PER_SECOND = 1000;

/** Loads the current weather at a launch site from Open-Meteo. */
@Injectable({ providedIn: 'root' })
export class OpenMeteoClient {
  private readonly http = inject(HttpClient);

  fetchCurrentWeather(site: LaunchSite): Observable<WeatherReport> {
    return this.http
      .get<OpenMeteoForecastResponse>(OPEN_METEO_FORECAST_URL, {
        params: {
          latitude: site.latitude,
          longitude: site.longitude,
          current: 'temperature_2m,precipitation,cloud_cover,wind_speed_10m,wind_gusts_10m,weather_code',
          daily: 'sunrise,sunset',
          wind_speed_unit: 'ms',
          timeformat: 'unixtime',
          // Daily values (sunrise, sunset) refer to the local day at the site.
          timezone: site.timeZone,
          forecast_days: 1
        }
      })
      .pipe(map(toWeatherReport));
  }
}

export function toWeatherReport(response: OpenMeteoForecastResponse): WeatherReport {
  const { current, daily } = response;

  return {
    source: 'live',
    observedAtMs: current.time * MS_PER_SECOND,
    condition: weatherConditionFromWmoCode(current.weather_code),
    temperatureCelsius: current.temperature_2m,
    windSpeedMetersPerSecond: current.wind_speed_10m,
    windGustsMetersPerSecond: current.wind_gusts_10m,
    precipitationMillimeters: current.precipitation,
    cloudCoverPercent: current.cloud_cover,
    sunriseAtMs: daily.sunrise[0]! * MS_PER_SECOND,
    sunsetAtMs: daily.sunset[0]! * MS_PER_SECOND
  };
}
