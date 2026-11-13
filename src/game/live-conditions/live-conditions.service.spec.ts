import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngxs/store';

import { GuiState } from '../../store';
import { LiveConditionsService } from './live-conditions.service';
import { OPEN_METEO_FORECAST_URL } from './open-meteo';
import { SAMPLE_OPEN_METEO_RESPONSE } from './open-meteo.testing';

describe('LiveConditionsService', () => {
  let service: LiveConditionsService;
  let http: HttpTestingController;

  const weatherRequest = () => http.expectOne((request) => request.url === OPEN_METEO_FORECAST_URL);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideStore([GuiState]), provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(LiveConditionsService);
    http = TestBed.inject(HttpTestingController);
    TestBed.tick();
  });

  it('shows typical weather until live data has arrived', () => {
    expect(service.weather().source).toBe('typical');
    expect(service.site().name).toBe('Kourou');
  });

  it('uses live weather once it has loaded', () => {
    weatherRequest().flush(SAMPLE_OPEN_METEO_RESPONSE);

    expect(service.weather().source).toBe('live');
    expect(service.weather().temperatureCelsius).toBe(SAMPLE_OPEN_METEO_RESPONSE.current.temperature_2m);
  });

  it('falls back to typical weather when the weather service cannot be reached', () => {
    weatherRequest().error(new ProgressEvent('network error'));

    expect(service.weather().source).toBe('typical');
  });

  it('knows whether the sun is up at the launch site', () => {
    weatherRequest().flush(SAMPLE_OPEN_METEO_RESPONSE);
    const { sunriseAtMs, sunsetAtMs } = service.weather();

    service.nowMs.set(sunriseAtMs + 1);
    expect(service.isDaylight()).toBe(true);

    service.nowMs.set(sunsetAtMs + 1);
    expect(service.isDaylight()).toBe(false);
  });
});
