import { DecimalPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { dispatch, select } from '@ngxs/store';

import { availableDecisions, holdDurationMs, successChance } from '../../game/launch/countdown';
import { SCRUB_COSTS } from '../../game/launch/launch.constants';
import type { CountdownDecision, Station } from '../../game/launch/launch.model';
import { LiveConditionsService } from '../../game/live-conditions/live-conditions.service';
import { ROCKET_MODELS } from '../../game/rockets/rockets.constants';
import { CloseCountdown, DecideOnCountdownIssue, LaunchState } from '../../store';
import { weatherConditionLabel } from '../live-conditions/weather-condition-display';
import { EurosPipe } from '../shared/euros.pipe';
import { countdownLogText, issueDescription, issueTitle, outcomeText, stationLabel } from './launch-texts';
import { MissionTimePipe } from './mission-time.pipe';

const STATIONS: readonly Station[] = ['propulsion', 'guidance', 'range', 'weather', 'flightDynamics'];
const MS_PER_SECOND = 1000;

/** Mission control during the countdown and flight, and the result once it is over. */
@Component({
  selector: 'app-countdown',
  imports: [DecimalPipe, PercentPipe, MatButtonModule, RouterLink, EurosPipe, MissionTimePipe],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'game-page' }
})
export class CountdownComponent {
  private readonly router = inject(Router);
  private readonly liveConditions = inject(LiveConditionsService);

  protected readonly countdown = select(LaunchState.countdown);
  protected readonly result = select(LaunchState.lastResult);
  protected readonly weather = this.liveConditions.weather;
  protected readonly stations = STATIONS;
  protected readonly scrubCosts = SCRUB_COSTS;

  protected readonly stationLabel = stationLabel;
  protected readonly issueTitle = issueTitle;
  protected readonly issueDescription = issueDescription;
  protected readonly outcomeText = outcomeText;
  protected readonly logText = countdownLogText;
  protected readonly weatherConditionLabel = weatherConditionLabel;

  protected readonly rocketModel = computed(() => {
    const countdown = this.countdown();
    return countdown ? ROCKET_MODELS[countdown.mission.rocketModelId] : null;
  });

  protected readonly successChance = computed(() => {
    const countdown = this.countdown();
    return countdown ? successChance(countdown) : 0;
  });

  protected readonly decisions = computed(() => {
    const countdown = this.countdown();
    return countdown ? availableDecisions(countdown.status) : [];
  });

  /** Log with the newest message on top, so the latest news is always visible. */
  protected readonly newestLogEntriesFirst = computed(() => [...(this.countdown()?.log ?? [])].reverse());

  private readonly dispatchDecision = dispatch(DecideOnCountdownIssue);
  private readonly dispatchClose = dispatch(CloseCountdown);

  protected decide(decision: CountdownDecision): void {
    this.dispatchDecision(decision);
  }

  protected holdDurationSeconds(): number {
    const countdown = this.countdown();
    if (countdown?.status.kind !== 'awaitingDecision') {
      return 0;
    }
    return holdDurationMs(countdown, countdown.status.issue) / MS_PER_SECOND;
  }

  protected close(): void {
    this.dispatchClose().subscribe(() => void this.router.navigate(['/game/launch-pad']));
  }
}
