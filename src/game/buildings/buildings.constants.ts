import type { Euros } from '../economy/economy.constants';
import type { BuildingLevelPlan, BuildingType } from './building.model';

// Balancing values. First estimates, to be tuned with play experience.

/** Order in which buildings are listed. */
export const BUILDING_TYPES: readonly BuildingType[] = [
  'assemblyHall',
  'port',
  'controlCenter',
  'laboratory',
  'weatherStation',
  'accommodation'
];

/**
 * Level a building has at the start of a game, without any construction.
 * Every spaceport needs an assembly hall, a port and a control center from day one.
 */
export const BUILDING_BASE_LEVEL: Record<BuildingType, number> = {
  assemblyHall: 1,
  port: 1,
  controlCenter: 1,
  laboratory: 0,
  weatherStation: 0,
  accommodation: 0
};

/** Levels that can be built on top of the base level, in order. */
export const BUILDING_LEVELS: Record<BuildingType, readonly BuildingLevelPlan[]> = {
  assemblyHall: [
    { level: 2, cost: 15_000_000, constructionDays: 10 },
    { level: 3, cost: 25_000_000, constructionDays: 14 }
  ],
  port: [
    { level: 2, cost: 6_000_000, constructionDays: 8 },
    { level: 3, cost: 10_000_000, constructionDays: 10 }
  ],
  controlCenter: [
    { level: 2, cost: 8_000_000, constructionDays: 8 },
    { level: 3, cost: 14_000_000, constructionDays: 10 }
  ],
  laboratory: [
    { level: 1, cost: 5_000_000, constructionDays: 6 },
    { level: 2, cost: 8_000_000, constructionDays: 8 },
    { level: 3, cost: 12_000_000, constructionDays: 10 }
  ],
  weatherStation: [
    { level: 1, cost: 4_000_000, constructionDays: 5 },
    { level: 2, cost: 7_000_000, constructionDays: 7 }
  ],
  accommodation: [
    { level: 1, cost: 3_000_000, constructionDays: 5 },
    { level: 2, cost: 5_000_000, constructionDays: 6 },
    { level: 3, cost: 8_000_000, constructionDays: 8 }
  ]
};

/** Daily upkeep per level that was built (base levels are covered by the operating costs). */
export const UPKEEP_PER_LEVEL_PER_DAY: Record<BuildingType, Euros> = {
  assemblyHall: 40_000,
  port: 20_000,
  controlCenter: 25_000,
  laboratory: 30_000,
  weatherStation: 15_000,
  accommodation: 10_000
};

/** Each assembly hall level adds a bay, so one more rocket can be assembled at the same time. */
export const ASSEMBLY_SLOTS_PER_LEVEL = 1;

/** Each port level above the first (larger quay, own cranes) brings deliveries this many days sooner. */
export const SHIPPING_DAYS_SAVED_PER_PORT_LEVEL = 2;

/** Each control center level above the first (simulators, training) counts as one extra experience level. */
export const CREW_LEVEL_BONUS_PER_CONTROL_CENTER_LEVEL = 1;

/** Each weather station level shortens weather holds by this share (local measurements, better nowcasts). */
export const WEATHER_HOLD_REDUCTION_PER_STATION_LEVEL = 0.2;

/** Each accommodation level houses this many more staff. */
export const STAFF_CAPACITY_PER_ACCOMMODATION_LEVEL = 4;

/** Each laboratory level adds one lab slot for a study or for the spaceport's own research. */
export const LAB_SLOTS_PER_LEVEL = 1;

/** Research points a free lab slot produces per game day. */
export const RESEARCH_POINTS_PER_FREE_LAB_SLOT_PER_DAY = 3;
