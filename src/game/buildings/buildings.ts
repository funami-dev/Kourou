import type { Euros } from '../economy/economy.constants';
import type { Building, BuildingEffects, BuildingLevelPlan, BuildingType, Construction } from './building.model';
import {
  ASSEMBLY_SLOTS_PER_LEVEL,
  BUILDING_BASE_LEVEL,
  BUILDING_LEVELS,
  CREW_LEVEL_BONUS_PER_CONTROL_CENTER_LEVEL,
  LAB_SLOTS_PER_LEVEL,
  SHIPPING_DAYS_SAVED_PER_PORT_LEVEL,
  STAFF_CAPACITY_PER_ACCOMMODATION_LEVEL,
  UPKEEP_PER_LEVEL_PER_DAY,
  WEATHER_HOLD_REDUCTION_PER_STATION_LEVEL
} from './buildings.constants';

export function findBuilding(buildings: readonly Building[], type: BuildingType): Building | undefined {
  return buildings.find((building) => building.type === type);
}

/** Levels added by construction that are finished on the given day. */
function completedConstructions(building: Building | undefined, day: number): number {
  return building?.constructions.filter((construction) => construction.completesOnDay <= day).length ?? 0;
}

/** Level of a building on the given day; 0 while it does not exist yet. */
export function buildingLevel(buildings: readonly Building[], type: BuildingType, day: number): number {
  return BUILDING_BASE_LEVEL[type] + completedConstructions(findBuilding(buildings, type), day);
}

export function maxBuildingLevel(type: BuildingType): number {
  return BUILDING_BASE_LEVEL[type] + BUILDING_LEVELS[type].length;
}

/** The construction still in progress on the given day, if any. */
export function constructionInProgress(
  buildings: readonly Building[],
  type: BuildingType,
  day: number
): Construction | null {
  return findBuilding(buildings, type)?.constructions.find((construction) => construction.completesOnDay > day) ?? null;
}

/** The level that could be built next, or `null` while construction is running or the top level is reached. */
export function nextLevelPlan(
  buildings: readonly Building[],
  type: BuildingType,
  day: number
): BuildingLevelPlan | null {
  if (constructionInProgress(buildings, type, day)) {
    return null;
  }
  const constructionsSoFar = findBuilding(buildings, type)?.constructions.length ?? 0;
  return BUILDING_LEVELS[type][constructionsSoFar] ?? null;
}

/** Starts building the next level. Returns `null` if that is not possible right now. */
export function startConstruction(buildings: readonly Building[], type: BuildingType, day: number): Building[] | null {
  const plan = nextLevelPlan(buildings, type, day);
  if (!plan) {
    return null;
  }

  const construction: Construction = {
    level: plan.level,
    startedOnDay: day,
    completesOnDay: day + plan.constructionDays
  };
  const building = findBuilding(buildings, type);
  if (!building) {
    return [...buildings, { type, constructions: [construction] }];
  }
  return buildings.map((candidate) =>
    candidate === building ? { ...building, constructions: [...building.constructions, construction] } : candidate
  );
}

/** Daily upkeep of all levels that were built. */
export function dailyUpkeep(buildings: readonly Building[], day: number): Euros {
  return buildings.reduce(
    (sum, building) => sum + completedConstructions(building, day) * UPKEEP_PER_LEVEL_PER_DAY[building.type],
    0
  );
}

/** What a building of the given level provides, as one number in the unit of its effect. */
export function buildingEffectAtLevel(type: BuildingType, level: number): number {
  switch (type) {
    case 'assemblyHall':
      return level * ASSEMBLY_SLOTS_PER_LEVEL;
    case 'port':
      return Math.max(0, level - 1) * SHIPPING_DAYS_SAVED_PER_PORT_LEVEL;
    case 'controlCenter':
      return Math.max(0, level - 1) * CREW_LEVEL_BONUS_PER_CONTROL_CENTER_LEVEL;
    case 'laboratory':
      return level * LAB_SLOTS_PER_LEVEL;
    case 'weatherStation':
      // Share by which weather holds get shorter.
      return level * WEATHER_HOLD_REDUCTION_PER_STATION_LEVEL;
    case 'accommodation':
      return level * STAFF_CAPACITY_PER_ACCOMMODATION_LEVEL;
  }
}

/** What all buildings together provide on the given day. */
export function buildingEffects(buildings: readonly Building[], day: number): BuildingEffects {
  const effectOf = (type: BuildingType): number => buildingEffectAtLevel(type, buildingLevel(buildings, type, day));

  return {
    assemblySlots: effectOf('assemblyHall'),
    shippingDaysSaved: effectOf('port'),
    crewLevelBonus: effectOf('controlCenter'),
    weatherHoldDurationFactor: 1 - effectOf('weatherStation'),
    staffCapacityBonus: effectOf('accommodation'),
    laboratorySlots: effectOf('laboratory')
  };
}

/** Lab slots available on the given day. */
export function laboratorySlots(buildings: readonly Building[], day: number): number {
  return buildingEffects(buildings, day).laboratorySlots;
}
