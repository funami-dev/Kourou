import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngxs/store';

import { GuiState } from '../../store';
import { OPEN_METEO_FORECAST_URL } from '../../game/live-conditions/open-meteo';
import { SAMPLE_OPEN_METEO_RESPONSE } from '../../game/live-conditions/open-meteo.testing';
import { WeatherComponent } from './weather.component';

describe('WeatherComponent', () => {
  let fixture: ComponentFixture<WeatherComponent>;
  let http: HttpTestingController;

  const text = (): string => (fixture.nativeElement as HTMLElement).textContent!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherComponent],
      providers: [provideRouter([]), provideStore([GuiState]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(WeatherComponent);
    await fixture.whenStable();
  });

  it('shows live weather with attribution to the data source', async () => {
    http.expectOne((request) => request.url === OPEN_METEO_FORECAST_URL).flush(SAMPLE_OPEN_METEO_RESPONSE);
    await fixture.whenStable();

    expect(text()).toContain('Kourou');
    expect(text()).toContain('Regen');
    expect(text()).toContain('Open-Meteo.com');
  });

  it('says so when only typical values are available', async () => {
    http.expectOne((request) => request.url === OPEN_METEO_FORECAST_URL).error(new ProgressEvent('offline'));
    await fixture.whenStable();

    expect(text()).toContain('keine Live-Wetterdaten');
  });
});
