import { BUILDING_LEVELS, UPKEEP_PER_LEVEL_PER_DAY } from './buildings.constants';
import {
  buildingEffects,
  buildingLevel,
  constructionInProgress,
  dailyUpkeep,
  findBuilding,
  laboratorySlots,
  maxBuildingLevel,
  nextLevelPlan,
  startConstruction
} from './buildings';

const [LAB_LEVEL_1, LAB_LEVEL_2] = BUILDING_LEVELS.laboratory;

describe('buildings', () => {
  const underConstruction = startConstruction([], 'laboratory', 3)!;
  const firstLevelReadyOn = 3 + LAB_LEVEL_1!.constructionDays;

  it('builds the first level of a new building', () => {
    expect(findBuilding(underConstruction, 'laboratory')?.constructions).toEqual([
      { level: 1, startedOnDay: 3, completesOnDay: firstLevelReadyOn }
    ]);
  });

  it('has level 0 until construction is finished', () => {
    expect(buildingLevel(underConstruction, 'laboratory', firstLevelReadyOn - 1)).toBe(0);
    expect(buildingLevel(underConstruction, 'laboratory', firstLevelReadyOn)).toBe(1);
  });

  it('allows no second construction while one is running', () => {
    expect(constructionInProgress(underConstruction, 'laboratory', 4)).not.toBeNull();
    expect(nextLevelPlan(underConstruction, 'laboratory', 4)).toBeNull();
    expect(startConstruction(underConstruction, 'laboratory', 4)).toBeNull();
  });

  it('can be upgraded once the previous level is finished', () => {
    expect(nextLevelPlan(underConstruction, 'laboratory', firstLevelReadyOn)).toEqual(LAB_LEVEL_2);

    const upgrading = startConstruction(underConstruction, 'laboratory', firstLevelReadyOn)!;
    // The finished level keeps working during the upgrade.
    expect(buildingLevel(upgrading, 'laboratory', firstLevelReadyOn + 1)).toBe(1);
    expect(buildingLevel(upgrading, 'laboratory', firstLevelReadyOn + LAB_LEVEL_2!.constructionDays)).toBe(2);
  });

  it('stops at the top level', () => {
    let buildings = startConstruction([], 'laboratory', 0)!;
    for (let level = 2; level <= maxBuildingLevel('laboratory'); level++) {
      buildings = startConstruction(buildings, 'laboratory', 1000 * level)!;
    }

    expect(nextLevelPlan(buildings, 'laboratory', 100_000)).toBeNull();
  });

  it('charges upkeep only for levels that were built', () => {
    expect(dailyUpkeep([], 4)).toBe(0);
    expect(dailyUpkeep(underConstruction, 4)).toBe(0);
    expect(dailyUpkeep(underConstruction, firstLevelReadyOn)).toBe(UPKEEP_PER_LEVEL_PER_DAY.laboratory);
    expect(laboratorySlots(underConstruction, firstLevelReadyOn)).toBe(1);
  });
});

describe('base buildings', () => {
  it('starts with an assembly hall, a port and a control center', () => {
    expect(buildingLevel([], 'assemblyHall', 1)).toBe(1);
    expect(buildingLevel([], 'port', 1)).toBe(1);
    expect(buildingLevel([], 'controlCenter', 1)).toBe(1);
    expect(buildingLevel([], 'weatherStation', 1)).toBe(0);
  });

  it('upgrades a base building to level 2', () => {
    expect(nextLevelPlan([], 'assemblyHall', 1)?.level).toBe(2);
  });
});

describe('buildingEffects', () => {
  it('provides the basics without any construction', () => {
    expect(buildingEffects([], 1)).toEqual({
      assemblySlots: 1,
      shippingDaysSaved: 0,
      crewLevelBonus: 0,
      weatherHoldDurationFactor: 1,
      staffCapacityBonus: 0,
      laboratorySlots: 0
    });
  });

  it('grows with each finished level', () => {
    let buildings = startConstruction([], 'assemblyHall', 0)!;
    buildings = startConstruction(buildings, 'port', 0)!;
    buildings = startConstruction(buildings, 'controlCenter', 0)!;
    buildings = startConstruction(buildings, 'weatherStation', 0)!;
    buildings = startConstruction(buildings, 'accommodation', 0)!;

    expect(buildingEffects(buildings, 100)).toEqual({
      assemblySlots: 2,
      shippingDaysSaved: 2,
      crewLevelBonus: 1,
      weatherHoldDurationFactor: 0.8,
      staffCapacityBonus: 4,
      laboratorySlots: 0
    });
  });
});
