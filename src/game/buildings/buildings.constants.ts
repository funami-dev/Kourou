import type { Euros } from '../economy/economy.constants';
import type { BuildingLevelPlan, BuildingType } from './building.model';

// Balancing values. First estimates, to be tuned with play experience.

/** Levels each building can be built to, in order. */
export const BUILDING_LEVELS: Record<BuildingType, readonly BuildingLevelPlan[]> = {
  laboratory: [
    { level: 1, cost: 5_000_000, constructionDays: 6 },
    { level: 2, cost: 8_000_000, constructionDays: 8 },
    { level: 3, cost: 12_000_000, constructionDays: 10 }
  ]
};

/** Daily upkeep per building level: staff, equipment and energy. */
export const UPKEEP_PER_LEVEL_PER_DAY: Record<BuildingType, Euros> = {
  laboratory: 30_000
};

/** Each laboratory level adds one lab slot for a study or for the spaceport's own research. */
export const LAB_SLOTS_PER_LEVEL = 1;

/** Research points a free lab slot produces per game day. */
export const RESEARCH_POINTS_PER_FREE_LAB_SLOT_PER_DAY = 3;
