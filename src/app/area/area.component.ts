import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LiveConditionsService } from '../live-conditions/live-conditions.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrl: './area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaComponent {
  /** Buildings switch to their night look when the sun has set at the launch site. */
  protected readonly isDaylight = inject(LiveConditionsService).isDaylight;
}
