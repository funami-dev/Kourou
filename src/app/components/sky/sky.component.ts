import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LiveConditionsService } from '../../live-conditions/live-conditions.service';

/** Sky backdrop that follows the real day and night at the launch site. */
@Component({
  selector: 'app-sky',
  templateUrl: './sky.component.html',
  styleUrl: './sky.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyComponent {
  protected readonly isDaylight = inject(LiveConditionsService).isDaylight;
}
