import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { select } from '@ngxs/store';

import { buildingLevel, constructionInProgress, findBuilding } from '../../game/buildings/buildings';
import { LiveConditionsService } from '../../game/live-conditions/live-conditions.service';
import { BuildingsState, ClockState } from '../../store';
import { LaboratoryBuildingComponent } from './laboratory-building/laboratory-building.component';

@Component({
  selector: 'app-area',
  imports: [LaboratoryBuildingComponent],
  templateUrl: './area.component.html',
  styleUrl: './area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaComponent {
  /** Buildings switch to their night look when the sun has set at the launch site. */
  protected readonly isDaylight = inject(LiveConditionsService).isDaylight;

  private readonly buildings = select(BuildingsState.buildings);
  private readonly today = select(ClockState.currentDay);

  /** The laboratory as shown on the grounds, or `null` if it has not been ordered yet. */
  protected readonly laboratory = computed(() => {
    const laboratory = findBuilding(this.buildings(), 'laboratory');
    if (!laboratory) {
      return null;
    }
    return {
      level: buildingLevel(laboratory, this.today()),
      isUnderConstruction: constructionInProgress(laboratory, this.today()) !== null
    };
  });
}
