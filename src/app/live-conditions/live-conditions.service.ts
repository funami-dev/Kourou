import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { select } from '@ngxs/store';
import { catchError, interval, of, startWith, switchMap } from 'rxjs';
import type { Observable } from 'rxjs';

import { DEFAULT_LAUNCH_SITE_ID, LAUNCH_SITES } from '../../game/launch-sites/launch-sites.constants';
import type { LaunchSite } from '../../game/launch-sites/launch-site.model';
import { isDaylight, typicalWeather } from '../../game/weather/typical-weather';
import type { WeatherReport } from '../../game/weather/weather.model';
import { GuiState } from '../../store';
import { OpenMeteoClient } from './open-meteo';

/** Open-Meteo updates its current conditions every 15 minutes; asking more often brings nothing new. */
const WEATHER_REFRESH_INTERVAL_MS = 15 * 60 * 1000;

/** The real clock only needs to be precise to the minute for display and day/night. */
const REAL_CLOCK_REFRESH_INTERVAL_MS = 15 * 1000;

/**
 * Real-world conditions at the current launch site: the actual local time and live weather.
 * Falls back to typical weather for the site when live data cannot be loaded, so the game keeps working offline.
 */
@Injectable({ providedIn: 'root' })
export class LiveConditionsService {
  private readonly openMeteo = inject(OpenMeteoClient);
  private readonly currentLocation = select(GuiState.getCurrentLocation);

  /** The launch site the conditions refer to. */
  readonly site = computed<LaunchSite>(() => LAUNCH_SITES[this.currentLocation() ?? DEFAULT_LAUNCH_SITE_ID]);

  /** Real time (epoch ms), refreshed regularly. */
  readonly nowMs = signal(Date.now());

  private readonly loadedWeather = signal<WeatherReport | null>(null);

  /** Current weather; typical values until live data has arrived or if it is unavailable. */
  readonly weather = computed(() => this.loadedWeather() ?? typicalWeather(this.site(), this.nowMs()));

  readonly isDaylight = computed(() => isDaylight(this.weather(), this.nowMs()));

  constructor() {
    const destroyRef = inject(DestroyRef);

    interval(REAL_CLOCK_REFRESH_INTERVAL_MS)
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe(() => this.nowMs.set(Date.now()));

    toObservable(this.site)
      .pipe(
        switchMap((site) =>
          interval(WEATHER_REFRESH_INTERVAL_MS).pipe(
            startWith(0),
            switchMap(() => this.loadWeather(site))
          )
        ),
        takeUntilDestroyed(destroyRef)
      )
      .subscribe((report) => this.loadedWeather.set(report));
  }

  private loadWeather(site: LaunchSite): Observable<WeatherReport> {
    return this.openMeteo.fetchCurrentWeather(site).pipe(catchError(() => of(typicalWeather(site, Date.now()))));
  }
}
