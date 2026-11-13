import type { WeatherCondition } from '../../game/weather/weather.model';

const WEATHER_CONDITION_LABELS: Record<WeatherCondition, string> = {
  clear: $localize`:@@weather.condition.clear:Klar`,
  partlyCloudy: $localize`:@@weather.condition.partlyCloudy:Teilweise bewölkt`,
  overcast: $localize`:@@weather.condition.overcast:Bedeckt`,
  fog: $localize`:@@weather.condition.fog:Nebel`,
  drizzle: $localize`:@@weather.condition.drizzle:Nieselregen`,
  rain: $localize`:@@weather.condition.rain:Regen`,
  snow: $localize`:@@weather.condition.snow:Schnee`,
  thunderstorm: $localize`:@@weather.condition.thunderstorm:Gewitter`
};

/** Material icon names for each condition. */
const WEATHER_CONDITION_ICONS: Record<WeatherCondition, string> = {
  clear: 'wb_sunny',
  partlyCloudy: 'filter_drama',
  overcast: 'cloud',
  fog: 'blur_on',
  drizzle: 'grain',
  rain: 'water_drop',
  snow: 'ac_unit',
  thunderstorm: 'thunderstorm'
};

export function weatherConditionLabel(condition: WeatherCondition): string {
  return WEATHER_CONDITION_LABELS[condition];
}

/** Icon for the condition; a clear sky at night shows the moon instead of the sun. */
export function weatherConditionIcon(condition: WeatherCondition, isDaylight: boolean): string {
  return condition === 'clear' && !isDaylight ? 'nightlight' : WEATHER_CONDITION_ICONS[condition];
}
