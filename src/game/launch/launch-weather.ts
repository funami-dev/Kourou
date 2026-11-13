import type { RocketModel } from '../rockets/rocket.model';
import type { WeatherReport } from '../weather/weather.model';
import { WEATHER_RISK } from './launch.constants';

export type WeatherConstraint = 'thunderstorm' | 'windGusts';

export type LaunchWeatherAssessment =
  | { verdict: 'go' }
  | { verdict: 'noGo'; violatedConstraints: WeatherConstraint[]; riskIfIgnored: number };

/**
 * The weather officer's verdict: no launch in a thunderstorm (lightning can strike the rocket)
 * or in gusts stronger than the rocket is built for. Rain alone is acceptable.
 */
export function assessLaunchWeather(
  weather: WeatherReport,
  rocket: Pick<RocketModel, 'maxWindGustsMetersPerSecond'>
): LaunchWeatherAssessment {
  const violatedConstraints: WeatherConstraint[] = [];
  if (weather.condition === 'thunderstorm') {
    violatedConstraints.push('thunderstorm');
  }
  if (weather.windGustsMetersPerSecond > rocket.maxWindGustsMetersPerSecond) {
    violatedConstraints.push('windGusts');
  }

  if (violatedConstraints.length === 0) {
    return { verdict: 'go' };
  }

  return {
    verdict: 'noGo',
    violatedConstraints,
    riskIfIgnored: violatedConstraints.reduce((risk, constraint) => risk + WEATHER_RISK[constraint], 0)
  };
}
