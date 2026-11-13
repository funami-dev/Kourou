import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { SiteLocalTimePipe } from '../shared/site-local-time.pipe';
import { LiveConditionsService } from '../../game/live-conditions/live-conditions.service';
import { weatherConditionIcon, weatherConditionLabel } from './weather-condition-display';

/** Compact toolbar display of the real local time and weather at the launch site. */
@Component({
  selector: 'app-live-conditions-indicator',
  imports: [DecimalPipe, MatButtonModule, MatIconModule, RouterLink, SiteLocalTimePipe],
  templateUrl: './live-conditions-indicator.component.html',
  styleUrl: './live-conditions-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveConditionsIndicatorComponent {
  private readonly liveConditions = inject(LiveConditionsService);

  protected readonly site = this.liveConditions.site;
  protected readonly nowMs = this.liveConditions.nowMs;
  protected readonly weather = this.liveConditions.weather;
  protected readonly icon = computed(() =>
    weatherConditionIcon(this.weather().condition, this.liveConditions.isDaylight())
  );
  protected readonly accessibleLabel = computed(() => {
    const conditionLabel = weatherConditionLabel(this.weather().condition);
    return this.weather().source === 'live'
      ? $localize`:@@weather.indicator.label:Wetter in ${this.site().name}:site:: ${conditionLabel}:condition:`
      : $localize`:@@weather.indicator.labelTypical:Wetter in ${this.site().name}:site:: ${conditionLabel}:condition: (typische Werte, keine Live-Daten)`;
  });
}
