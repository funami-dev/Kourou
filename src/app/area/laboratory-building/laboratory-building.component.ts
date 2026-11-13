import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** The laboratory on the spaceport grounds. Links to the research page. */
@Component({
  selector: 'app-laboratory-building',
  imports: [RouterLink],
  templateUrl: './laboratory-building.component.html',
  styleUrl: './laboratory-building.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LaboratoryBuildingComponent {
  /** Level that is in operation; 0 while the first level is still being built. */
  readonly level = input.required<number>();
  readonly isUnderConstruction = input.required<boolean>();
  readonly isDaylight = input.required<boolean>();
}
