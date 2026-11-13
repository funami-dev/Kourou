import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { dispatch, select } from '@ngxs/store';

import { buildingLevel, constructionInProgress, nextLevelPlan } from '../../game/buildings/buildings';
import {
  LAB_SLOTS_PER_LEVEL,
  RESEARCH_POINTS_PER_FREE_LAB_SLOT_PER_DAY,
  UPKEEP_PER_LEVEL_PER_DAY
} from '../../game/buildings/buildings.constants';
import type { ResearchOffer } from '../../game/research/research-contract.model';
import { canAcceptResearchOffer, studiesInLabOn } from '../../game/research/research-contracts';
import { MAX_FLIGHT_EXPERIMENTS_IN_PROGRESS } from '../../game/research/research-contracts.constants';
import { technologyStatus } from '../../game/research/research';
import { TECHNOLOGIES, TECHNOLOGY_BRANCHES } from '../../game/research/technologies.constants';
import type { TechnologyId } from '../../game/research/technology.model';
import {
  AcceptResearchOffer,
  BuildingsState,
  ClockState,
  FinanceState,
  ResearchContractsState,
  ResearchState,
  StartBuildingConstruction,
  StartResearch
} from '../../store';
import { EurosPipe } from '../shared/euros.pipe';
import {
  branchName,
  researchContractStatusLabel,
  researchTopicName,
  technologyDescription,
  technologyName
} from './research-texts';

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

  private readonly researchMarket = select(ResearchContractsState.market);

  protected readonly technologyName = technologyName;
  protected readonly researchTopicName = researchTopicName;
  protected readonly researchContractStatusLabel = researchContractStatusLabel;
  protected readonly maxFlightExperiments = MAX_FLIGHT_EXPERIMENTS_IN_PROGRESS;
  protected readonly technologyDescription = technologyDescription;
  protected readonly branchName = branchName;

  protected readonly laboratory = computed(() => {
    const level = buildingLevel(this.buildings(), 'laboratory', this.today());
    const slots = level * LAB_SLOTS_PER_LEVEL;
    const occupiedSlots = studiesInLabOn(this.researchMarket().contracts, this.today());
    const nextLevel = nextLevelPlan(this.buildings(), 'laboratory', this.today());

    return {
      level,
      slots,
      occupiedSlots,
      researchPointsPerDay: Math.max(0, slots - occupiedSlots) * RESEARCH_POINTS_PER_FREE_LAB_SLOT_PER_DAY,
      upkeepPerDay: level * UPKEEP_PER_LEVEL_PER_DAY.laboratory,
      construction: constructionInProgress(this.buildings(), 'laboratory', this.today()),
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

  protected readonly researchOffers = computed(() =>
    this.researchMarket().offers.map((offer) => ({
      offer,
      canAccept: canAcceptResearchOffer(this.researchMarket(), offer, this.laboratory().slots, this.today())
    }))
  );

  /** Accepted research contracts, newest first. */
  protected readonly researchContracts = computed(() => [...this.researchMarket().contracts].reverse());

  private readonly dispatchAcceptResearchOffer = dispatch(AcceptResearchOffer);

  protected acceptResearchOffer(offer: ResearchOffer): void {
    this.dispatchAcceptResearchOffer(offer.id);
  }

  protected readonly buildLaboratory = dispatch(StartBuildingConstruction);
  private readonly dispatchStartResearch = dispatch(StartResearch);

  protected startResearch(technologyId: TechnologyId): void {
    this.dispatchStartResearch(technologyId);
  }
}
