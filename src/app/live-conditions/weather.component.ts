import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { SiteLocalTimePipe } from '../shared/site-local-time.pipe';
import { LiveConditionsService } from '../../game/live-conditions/live-conditions.service';
import { OPEN_METEO_ATTRIBUTION_URL } from '../../game/live-conditions/open-meteo';
import { weatherConditionIcon, weatherConditionLabel } from './weather-condition-display';

/** Detailed view of the real local time and live weather at the launch site. */
@Component({
  selector: 'app-weather',
  imports: [DecimalPipe, MatIconModule, SiteLocalTimePipe],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'game-page' }
})
export class WeatherComponent {
  private readonly liveConditions = inject(LiveConditionsService);

  protected readonly site = this.liveConditions.site;
  protected readonly nowMs = this.liveConditions.nowMs;
  protected readonly weather = this.liveConditions.weather;
  protected readonly isDaylight = this.liveConditions.isDaylight;
  protected readonly icon = computed(() => weatherConditionIcon(this.weather().condition, this.isDaylight()));
  protected readonly conditionLabel = computed(() => weatherConditionLabel(this.weather().condition));
  protected readonly attributionUrl = OPEN_METEO_ATTRIBUTION_URL;
}
