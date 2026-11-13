import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { dispatch, select } from '@ngxs/store';

import { buildingLevel, constructionInProgress, findBuilding, nextLevelPlan } from '../../game/buildings/buildings';
import {
  LAB_SLOTS_PER_LEVEL,
  RESEARCH_POINTS_PER_FREE_LAB_SLOT_PER_DAY,
  UPKEEP_PER_LEVEL_PER_DAY
} from '../../game/buildings/buildings.constants';
import { technologyStatus } from '../../game/research/research';
import { TECHNOLOGIES, TECHNOLOGY_BRANCHES } from '../../game/research/technologies.constants';
import type { TechnologyId } from '../../game/research/technology.model';
import {
  BuildingsState,
  ClockState,
  FinanceState,
  ResearchState,
  StartBuildingConstruction,
  StartResearch
} from '../../store';
import { EurosPipe } from '../shared/euros.pipe';
import { branchName, technologyDescription, technologyName } from './research-texts';

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
  private readonly researchProgress = select(ResearchState.progress);

  protected readonly technologyName = technologyName;
  protected readonly technologyDescription = technologyDescription;
  protected readonly branchName = branchName;

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

  /** The technology tree by branch, with what the player can do with each technology right now. */
  protected readonly technologyTree = computed(() => {
    const progress = this.researchProgress();
    const hasLaboratory = this.laboratory().level > 0;

    return TECHNOLOGY_BRANCHES.map((branch) => ({
      branch,
      technologies: Object.values(TECHNOLOGIES)
        .filter((technology) => technology.branch === branch)
        .map((technology) => ({
          technology,
          status: technologyStatus(progress, technology.id),
          canStart:
            hasLaboratory &&
            progress.activeProject === null &&
            technologyStatus(progress, technology.id) === 'available' &&
            progress.researchPoints >= technology.researchPointCost &&
            this.balance() >= technology.cost
        }))
    }));
  });

  protected readonly activeProject = computed(() => this.researchProgress().activeProject);

  protected readonly buildLaboratory = dispatch(StartBuildingConstruction);
  private readonly dispatchStartResearch = dispatch(StartResearch);

  protected startResearch(technologyId: TechnologyId): void {
    this.dispatchStartResearch(technologyId);
  }
}
