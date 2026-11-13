import type { Euros } from '../economy/economy.constants';
import type { Building, BuildingLevelPlan, BuildingType, Construction } from './building.model';
import { BUILDING_LEVELS, LAB_SLOTS_PER_LEVEL, UPKEEP_PER_LEVEL_PER_DAY } from './buildings.constants';

export function findBuilding(buildings: readonly Building[], type: BuildingType): Building | undefined {
  return buildings.find((building) => building.type === type);
}

/** Level the building has on the given day; 0 while it is not built yet. */
export function buildingLevel(building: Building | undefined, day: number): number {
  return building?.constructions.filter((construction) => construction.completesOnDay <= day).length ?? 0;
}

/** The construction still in progress on the given day, if any. */
export function constructionInProgress(building: Building | undefined, day: number): Construction | null {
  return building?.constructions.find((construction) => construction.completesOnDay > day) ?? null;
}

/** The level that could be built next, or `null` while construction is running or the top level is reached. */
export function nextLevelPlan(
  buildings: readonly Building[],
  type: BuildingType,
  day: number
): BuildingLevelPlan | null {
  const building = findBuilding(buildings, type);
  if (constructionInProgress(building, day)) {
    return null;
  }
  const builtLevels = building?.constructions.length ?? 0;
  return BUILDING_LEVELS[type][builtLevels] ?? null;
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

/** Daily upkeep of all finished building levels. */
export function dailyUpkeep(buildings: readonly Building[], day: number): Euros {
  return buildings.reduce(
    (sum, building) => sum + buildingLevel(building, day) * UPKEEP_PER_LEVEL_PER_DAY[building.type],
    0
  );
}

/** Lab slots available on the given day. */
export function laboratorySlots(buildings: readonly Building[], day: number): number {
  return buildingLevel(findBuilding(buildings, 'laboratory'), day) * LAB_SLOTS_PER_LEVEL;
}
