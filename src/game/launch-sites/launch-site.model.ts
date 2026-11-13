export type LaunchSiteId = 'kourou';

export interface LaunchSite {
  id: LaunchSiteId;
  /** Proper name, not translated. */
  name: string;
  latitude: number;
  longitude: number;
  /** IANA time zone, used to show the real local time at the site. */
  timeZone: string;
  /** Typical local climate, used when no live weather data is available. */
  climate: LaunchSiteClimate;
}

export interface LaunchSiteClimate {
  /** Months (1–12) of the rainy season. */
  rainySeasonMonths: readonly number[];
  typicalTemperatureCelsius: number;
  typicalWindSpeedMetersPerSecond: number;
  /** Typical local sunrise and sunset as hours after midnight (e.g. 6.25 = 06:15). */
  typicalSunriseHour: number;
  typicalSunsetHour: number;
}
