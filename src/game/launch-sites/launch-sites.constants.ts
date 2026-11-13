import type { LaunchSite, LaunchSiteId } from './launch-site.model';

export const LAUNCH_SITES: Record<LaunchSiteId, LaunchSite> = {
  kourou: {
    id: 'kourou',
    name: 'Kourou',
    // Guiana Space Centre, French Guiana – about 5° north of the equator.
    latitude: 5.236,
    longitude: -52.769,
    timeZone: 'America/Cayenne',
    climate: {
      // Rainy season roughly from December to July, dry season from August to November.
      rainySeasonMonths: [12, 1, 2, 3, 4, 5, 6, 7],
      typicalTemperatureCelsius: 27,
      typicalWindSpeedMetersPerSecond: 4,
      // Close to the equator, day length barely changes over the year.
      typicalSunriseHour: 6.25,
      typicalSunsetHour: 18.5
    }
  }
};

export const DEFAULT_LAUNCH_SITE_ID: LaunchSiteId = 'kourou';
