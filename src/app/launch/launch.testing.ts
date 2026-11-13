import { signal } from '@angular/core';
import type { Provider } from '@angular/core';

import { LAUNCH_SITES } from '../../game/launch-sites/launch-sites.constants';
import { LiveConditionsService } from '../../game/live-conditions/live-conditions.service';
import { typicalWeather } from '../../game/weather/typical-weather';

/** 10:00 local time in Kourou (UTC−3), dry season: the LEO launch window is open and the weather calm. */
export const MORNING_IN_KOUROU = Date.UTC(2026, 8, 15, 13, 0);

/** Replaces live weather and real time with a calm morning in Kourou, so tests do not depend on the real world. */
export function provideCalmMorningInKourou(): Provider {
  const kourou = LAUNCH_SITES.kourou;
  const weather = typicalWeather(kourou, MORNING_IN_KOUROU);

  return {
    provide: LiveConditionsService,
    useValue: {
      site: signal(kourou),
      nowMs: signal(MORNING_IN_KOUROU),
      weather: signal(weather),
      isDaylight: signal(true)
    }
  };
}
