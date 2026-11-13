import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { select } from '@ngxs/store';

import { buildingLevel, constructionInProgress } from '../../game/buildings/buildings';
import { BUILDING_TYPES } from '../../game/buildings/buildings.constants';
import { LiveConditionsService } from '../../game/live-conditions/live-conditions.service';
import { BuildingsState, ClockState } from '../../store';
import { BuildingSpriteComponent } from './building-sprite/building-sprite.component';

@Component({
  selector: 'app-area',
  imports: [BuildingSpriteComponent],
  templateUrl: './area.component.html',
  styleUrl: './area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaComponent {
  /** Buildings switch to their night look when the sun has set at the launch site. */
  protected readonly isDaylight = inject(LiveConditionsService).isDaylight;

  private readonly buildings = select(BuildingsState.buildings);
  private readonly today = select(ClockState.currentDay);

  /** Buildings that exist or are being built; buildings not ordered yet are not shown. */
  protected readonly buildingsOnGrounds = computed(() =>
    BUILDING_TYPES.map((type) => ({
      type,
      level: buildingLevel(this.buildings(), type, this.today()),
      isUnderConstruction: constructionInProgress(this.buildings(), type, this.today()) !== null
    })).filter((building) => building.level > 0 || building.isUnderConstruction)
  );
}
