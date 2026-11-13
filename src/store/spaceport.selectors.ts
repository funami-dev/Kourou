import { createSelector } from '@ngxs/store';

import type { BuildingEffects } from '../game/buildings/building.model';
import { buildingEffects } from '../game/buildings/buildings';
import type { CountdownBonuses } from '../game/launch/launch.model';
import type { TechnologyBonuses } from '../game/research/technology.model';
import type { OrderBonuses } from '../game/rockets/rocket-fleet';
import { BASE_STAFF_CAPACITY } from '../game/staff/staff.constants';
import { BuildingsState } from './buildings/buildings.state';
import { ClockState } from './clock/clock.state';
import { ResearchState } from './research/research.state';

/**
 * Selectors that combine the effects of buildings and technologies.
 * Keeping them in one place makes clear where a bonus comes from and how bonuses add up.
 */

/** What all buildings provide today. */
export const selectBuildingEffects = createSelector(
  [BuildingsState.buildings, ClockState.currentDay],
  (buildings, today): BuildingEffects => buildingEffects(buildings, today)
);

/** Bonuses for new rocket orders: technologies speed up assembly, the port and technologies speed up delivery. */
export const selectOrderBonuses = createSelector(
  [ResearchState.bonuses, selectBuildingEffects],
  (technologies: TechnologyBonuses, buildings: BuildingEffects): OrderBonuses => ({
    assemblyDurationFactor: technologies.assemblyDurationFactor,
    shippingDaysSaved: technologies.shippingDaysSaved + buildings.shippingDaysSaved,
    assemblySlots: buildings.assemblySlots
  })
);

/** Bonuses for countdowns: weather radar and weather station both shorten weather holds. */
export const selectCountdownBonuses = createSelector(
  [ResearchState.bonuses, selectBuildingEffects],
  (technologies: TechnologyBonuses, buildings: BuildingEffects): CountdownBonuses => ({
    weatherHoldDurationFactor: technologies.weatherHoldDurationFactor * buildings.weatherHoldDurationFactor,
    preventedCountdownIssues: technologies.preventedCountdownIssues,
    reliabilityBonus: technologies.reliabilityBonus
  })
);

/** How many people the spaceport can house. */
export const selectStaffCapacity = createSelector(
  [selectBuildingEffects],
  (buildings: BuildingEffects): number => BASE_STAFF_CAPACITY + buildings.staffCapacityBonus
);
