import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { dispatch, select } from '@ngxs/store';

import type { BuildingType } from '../../game/buildings/building.model';
import { buildingLevel, constructionInProgress, maxBuildingLevel, nextLevelPlan } from '../../game/buildings/buildings';
import {
  BUILDING_BASE_LEVEL,
  BUILDING_TYPES,
  UPKEEP_PER_LEVEL_PER_DAY
} from '../../game/buildings/buildings.constants';
import { BuildingsState, ClockState, FinanceState, StartBuildingConstruction } from '../../store';
import { EurosPipe } from '../shared/euros.pipe';
import { buildingDescription, buildingEffectText, buildingName } from './building-texts';

/** All buildings of the spaceport: what they do, their level, and building or upgrading them. */
@Component({
  selector: 'app-buildings',
  imports: [MatButtonModule, EurosPipe],
  templateUrl: './buildings.component.html',
  styleUrl: './buildings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'game-page' }
})
export class BuildingsComponent {
  private readonly buildings = select(BuildingsState.buildings);
  private readonly today = select(ClockState.currentDay);
  private readonly balance = select(FinanceState.balance);

  protected readonly buildingName = buildingName;
  protected readonly buildingDescription = buildingDescription;
  protected readonly buildingEffectText = buildingEffectText;

  protected readonly overview = computed(() =>
    BUILDING_TYPES.map((type) => {
      const level = buildingLevel(this.buildings(), type, this.today());
      const nextLevel = nextLevelPlan(this.buildings(), type, this.today());
      const builtLevels = Math.max(0, level - BUILDING_BASE_LEVEL[type]);
      return {
        type,
        level,
        maxLevel: maxBuildingLevel(type),
        upkeepPerDay: builtLevels * UPKEEP_PER_LEVEL_PER_DAY[type],
        construction: constructionInProgress(this.buildings(), type, this.today()),
        nextLevel,
        canAffordNextLevel: nextLevel !== null && this.balance() >= nextLevel.cost
      };
    })
  );

  private readonly dispatchStartConstruction = dispatch(StartBuildingConstruction);

  protected build(type: BuildingType): void {
    this.dispatchStartConstruction(type);
  }
}
