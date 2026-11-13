import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { dispatch, select } from '@ngxs/store';

import { buildingLevel, constructionInProgress, findBuilding, nextLevelPlan } from '../../game/buildings/buildings';
import {
  LAB_SLOTS_PER_LEVEL,
  RESEARCH_POINTS_PER_FREE_LAB_SLOT_PER_DAY,
  UPKEEP_PER_LEVEL_PER_DAY
} from '../../game/buildings/buildings.constants';
import { BuildingsState, ClockState, FinanceState, ResearchState, StartBuildingConstruction } from '../../store';
import { EurosPipe } from '../shared/euros.pipe';

/** The laboratory, the spaceport's own research and research contracts. */
@Component({
  selector: 'app-research',
  imports: [MatButtonModule, EurosPipe],
  templateUrl: './research.component.html',
  styleUrl: './research.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'game-page' }
})
export class ResearchComponent {
  private readonly buildings = select(BuildingsState.buildings);
  private readonly balance = select(FinanceState.balance);
  protected readonly today = select(ClockState.currentDay);
  protected readonly researchPoints = select(ResearchState.researchPoints);

  protected readonly laboratory = computed(() => {
    const laboratory = findBuilding(this.buildings(), 'laboratory');
    const level = buildingLevel(laboratory, this.today());
    const slots = level * LAB_SLOTS_PER_LEVEL;
    const nextLevel = nextLevelPlan(this.buildings(), 'laboratory', this.today());

    return {
      level,
      slots,
      researchPointsPerDay: slots * RESEARCH_POINTS_PER_FREE_LAB_SLOT_PER_DAY,
      upkeepPerDay: level * UPKEEP_PER_LEVEL_PER_DAY.laboratory,
      construction: constructionInProgress(laboratory, this.today()),
      nextLevel,
      canAffordNextLevel: nextLevel !== null && this.balance() >= nextLevel.cost
    };
  });

  protected readonly buildLaboratory = dispatch(StartBuildingConstruction);
}
