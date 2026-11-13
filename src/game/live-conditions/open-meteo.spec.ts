import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LAUNCH_SITES } from '../launch-sites/launch-sites.constants';
import { OPEN_METEO_FORECAST_URL, OpenMeteoClient, toWeatherReport } from './open-meteo';
import { SAMPLE_OPEN_METEO_RESPONSE } from './open-meteo.testing';

describe('toWeatherReport', () => {
  it('turns the Open-Meteo response into a live weather report', () => {
    expect(toWeatherReport(SAMPLE_OPEN_METEO_RESPONSE)).toEqual({
      source: 'live',
      observedAtMs: 1_794_560_400_000,
      condition: 'rain',
      temperatureCelsius: 28.4,
      windSpeedMetersPerSecond: 4.6,
      windGustsMetersPerSecond: 9.1,
      precipitationMillimeters: 0.2,
      cloudCoverPercent: 63,
      sunriseAtMs: 1_794_538_020_000,
      sunsetAtMs: 1_794_581_640_000
    });
  });
});

describe('OpenMeteoClient', () => {
  it('asks for the weather at the launch site in metres per second and Unix time', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const http = TestBed.inject(HttpTestingController);
    let condition: string | undefined;

    TestBed.inject(OpenMeteoClient)
      .fetchCurrentWeather(LAUNCH_SITES.kourou)
      .subscribe((report) => (condition = report.condition));

    const request = http.expectOne((candidate) => candidate.url === OPEN_METEO_FORECAST_URL);
    expect(request.request.params.get('latitude')).toBe(String(LAUNCH_SITES.kourou.latitude));
    expect(request.request.params.get('wind_speed_unit')).toBe('ms');
    expect(request.request.params.get('timeformat')).toBe('unixtime');
    expect(request.request.params.get('timezone')).toBe('America/Cayenne');

    request.flush(SAMPLE_OPEN_METEO_RESPONSE);
    expect(condition).toBe('rain');
    http.verify();
  });
});
