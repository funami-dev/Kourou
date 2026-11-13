import { LAUNCH_SITES } from '../launch-sites/launch-sites.constants';
import { ROCKET_MODELS } from '../rockets/rockets.constants';
import { typicalWeather } from '../weather/typical-weather';
import type { WeatherReport } from '../weather/weather.model';
import { WEATHER_RISK } from './launch.constants';
import { assessLaunchWeather } from './launch-weather';

const calmWeather: WeatherReport = {
  ...typicalWeather(LAUNCH_SITES.kourou, Date.UTC(2026, 8, 15, 15)),
  condition: 'rain',
  windGustsMetersPerSecond: 8
};

describe('assessLaunchWeather', () => {
  it('allows a launch in calm weather, even with rain', () => {
    expect(assessLaunchWeather(calmWeather, ROCKET_MODELS.ibis)).toEqual({ verdict: 'go' });
  });

  it('forbids a launch in a thunderstorm', () => {
    expect(assessLaunchWeather({ ...calmWeather, condition: 'thunderstorm' }, ROCKET_MODELS.albatros)).toEqual({
      verdict: 'noGo',
      violatedConstraints: ['thunderstorm'],
      riskIfIgnored: WEATHER_RISK.thunderstorm
    });
  });

  it('compares gusts with the limit of the rocket', () => {
    const gusty = { ...calmWeather, windGustsMetersPerSecond: 15 };

    expect(assessLaunchWeather(gusty, ROCKET_MODELS.ibis).verdict).toBe('noGo');
    expect(assessLaunchWeather(gusty, ROCKET_MODELS.albatros).verdict).toBe('go');
  });

  it('adds up the risks of all violated constraints', () => {
    const stormy = { ...calmWeather, condition: 'thunderstorm' as const, windGustsMetersPerSecond: 20 };

    expect(assessLaunchWeather(stormy, ROCKET_MODELS.albatros)).toMatchObject({
      riskIfIgnored: WEATHER_RISK.thunderstorm + WEATHER_RISK.windGusts
    });
  });
});
