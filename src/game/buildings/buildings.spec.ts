import { BUILDING_LEVELS, UPKEEP_PER_LEVEL_PER_DAY } from './buildings.constants';
import {
  buildingLevel,
  constructionInProgress,
  dailyUpkeep,
  findBuilding,
  laboratorySlots,
  nextLevelPlan,
  startConstruction
} from './buildings';

const [LEVEL_1, LEVEL_2] = BUILDING_LEVELS.laboratory;

describe('buildings', () => {
  const underConstruction = startConstruction([], 'laboratory', 3)!;
  const firstLevelReadyOn = 3 + LEVEL_1!.constructionDays;

  it('builds the first level of a new building', () => {
    expect(findBuilding(underConstruction, 'laboratory')?.constructions).toEqual([
      { level: 1, startedOnDay: 3, completesOnDay: firstLevelReadyOn }
    ]);
  });

  it('has level 0 until construction is finished', () => {
    expect(buildingLevel(findBuilding(underConstruction, 'laboratory'), firstLevelReadyOn - 1)).toBe(0);
    expect(buildingLevel(findBuilding(underConstruction, 'laboratory'), firstLevelReadyOn)).toBe(1);
  });

  it('allows no second construction while one is running', () => {
    expect(constructionInProgress(findBuilding(underConstruction, 'laboratory'), 4)).not.toBeNull();
    expect(nextLevelPlan(underConstruction, 'laboratory', 4)).toBeNull();
    expect(startConstruction(underConstruction, 'laboratory', 4)).toBeNull();
  });

  it('can be upgraded once the previous level is finished', () => {
    expect(nextLevelPlan(underConstruction, 'laboratory', firstLevelReadyOn)).toEqual(LEVEL_2);

    const upgrading = startConstruction(underConstruction, 'laboratory', firstLevelReadyOn)!;
    const lab = findBuilding(upgrading, 'laboratory');
    // The finished level keeps working during the upgrade.
    expect(buildingLevel(lab, firstLevelReadyOn + 1)).toBe(1);
    expect(buildingLevel(lab, firstLevelReadyOn + LEVEL_2!.constructionDays)).toBe(2);
  });

  it('stops at the top level', () => {
    let buildings = startConstruction([], 'laboratory', 0)!;
    for (let level = 2; level <= BUILDING_LEVELS.laboratory.length; level++) {
      buildings = startConstruction(buildings, 'laboratory', 1000 * level)!;
    }

    expect(nextLevelPlan(buildings, 'laboratory', 100_000)).toBeNull();
  });

  it('charges upkeep and provides lab slots only for finished levels', () => {
    expect(dailyUpkeep(underConstruction, 4)).toBe(0);
    expect(laboratorySlots(underConstruction, 4)).toBe(0);
    expect(dailyUpkeep(underConstruction, firstLevelReadyOn)).toBe(UPKEEP_PER_LEVEL_PER_DAY.laboratory);
    expect(laboratorySlots(underConstruction, firstLevelReadyOn)).toBe(1);
  });
});
