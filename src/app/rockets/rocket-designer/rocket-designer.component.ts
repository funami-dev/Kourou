import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { dispatch, select } from '@ngxs/store';

import { designBlueprintId, designPerformance, normalizeDesignName } from '../../../game/rockets/rocket-design';
import type {
  BoosterCount,
  CoreStageId,
  FairingId,
  RocketDesignParts,
  UpperStageId
} from '../../../game/rockets/rocket-design.model';
import {
  BOOSTER_COUNTS,
  CORE_STAGES,
  FAIRINGS,
  MAX_DESIGN_NAME_LENGTH,
  UPPER_STAGES
} from '../../../game/rockets/rocket-parts.constants';
import type { RocketModel } from '../../../game/rockets/rocket.model';
import { RocketsState, SaveRocketDesign } from '../../../store';
import { RocketModelCardComponent } from '../rocket-model-card/rocket-model-card.component';
import { boosterCountLabel, coreStageName, fairingName, upperStageName } from '../rocket-part-texts';

const CORE_STAGE_IDS = Object.keys(CORE_STAGES) as CoreStageId[];
const UPPER_STAGE_IDS = Object.keys(UPPER_STAGES) as UpperStageId[];
const FAIRING_IDS = Object.keys(FAIRINGS) as FairingId[];

const STARTING_PARTS: RocketDesignParts = {
  coreStage: 'coreLight',
  boosterCount: 0,
  upperStage: 'upperBasic',
  fairing: 'fairingSmall'
};

/** Lets the player put together a rocket from parts, see its performance and save it as a design. */
@Component({
  selector: 'app-rocket-designer',
  imports: [MatButtonModule, RocketModelCardComponent],
  templateUrl: './rocket-designer.component.html',
  styleUrl: './rocket-designer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RocketDesignerComponent {
  protected readonly coreStageIds = CORE_STAGE_IDS;
  protected readonly upperStageIds = UPPER_STAGE_IDS;
  protected readonly fairingIds = FAIRING_IDS;
  protected readonly boosterCounts = BOOSTER_COUNTS;
  protected readonly maxNameLength = MAX_DESIGN_NAME_LENGTH;

  protected readonly coreStageName = coreStageName;
  protected readonly upperStageName = upperStageName;
  protected readonly fairingName = fairingName;
  protected readonly boosterCountLabel = boosterCountLabel;

  private readonly designs = select(RocketsState.designs);

  protected readonly parts = signal<RocketDesignParts>(STARTING_PARTS);
  protected readonly name = signal('');

  /** The design as it would be saved, to preview its performance. */
  protected readonly preview = computed(
    (): RocketModel => ({
      id: designBlueprintId(0),
      name: normalizeDesignName(this.name()) ?? this.suggestedName(),
      serialPrefix: '',
      ...designPerformance(this.parts())
    })
  );

  protected readonly suggestedName = computed(
    () => $localize`:@@rockets.designer.suggestedName:Eigenbau ${this.designs().length + 1}:number:`
  );

  private readonly dispatchSave = dispatch(SaveRocketDesign);

  protected selectCoreStage(value: string): void {
    const coreStage = CORE_STAGE_IDS.find((id) => id === value);
    if (coreStage) {
      this.parts.update((parts) => ({ ...parts, coreStage }));
    }
  }

  protected selectBoosterCount(value: string): void {
    const boosterCount = BOOSTER_COUNTS.find((count) => count === Number(value));
    if (boosterCount !== undefined) {
      this.parts.update((parts) => ({ ...parts, boosterCount: boosterCount as BoosterCount }));
    }
  }

  protected selectUpperStage(value: string): void {
    const upperStage = UPPER_STAGE_IDS.find((id) => id === value);
    if (upperStage) {
      this.parts.update((parts) => ({ ...parts, upperStage }));
    }
  }

  protected selectFairing(value: string): void {
    const fairing = FAIRING_IDS.find((id) => id === value);
    if (fairing) {
      this.parts.update((parts) => ({ ...parts, fairing }));
    }
  }

  protected save(): void {
    this.dispatchSave(normalizeDesignName(this.name()) ?? this.suggestedName(), this.parts());
    this.name.set('');
  }
}
