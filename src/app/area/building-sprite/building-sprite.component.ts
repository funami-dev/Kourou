import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { BuildingType } from '../../../game/buildings/building.model';
import { buildingName } from '../../buildings/building-texts';

/** A building on the spaceport grounds, drawn as a small isometric picture. Links to the buildings page. */
@Component({
  selector: 'app-building-sprite',
  imports: [RouterLink],
  templateUrl: './building-sprite.component.html',
  styleUrl: './building-sprite.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildingSpriteComponent {
  readonly type = input.required<BuildingType>();
  /** Level that is in operation; 0 while the first level is still being built. */
  readonly level = input.required<number>();
  readonly isUnderConstruction = input.required<boolean>();
  readonly isDaylight = input.required<boolean>();

  protected readonly label = computed(
    () => $localize`:@@area.building.label:${buildingName(this.type())}:building:, Stufe ${this.level()}:level:`
  );
}
