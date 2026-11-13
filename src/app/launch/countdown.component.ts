import { DecimalPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { dispatch, select } from '@ngxs/store';

import { availableDecisions, holdDurationMs, successChance } from '../../game/launch/countdown';
import { SCRUB_COSTS } from '../../game/launch/launch.constants';
import type { CountdownDecision } from '../../game/launch/launch.model';
import { LiveConditionsService } from '../../game/live-conditions/live-conditions.service';
import { CREW_ROLES } from '../../game/staff/staff.constants';
import { CloseCountdown, DecideOnCountdownIssue, LaunchState } from '../../store';
import { weatherConditionLabel } from '../live-conditions/weather-condition-display';
import { EurosPipe } from '../shared/euros.pipe';
import { roleLabel } from '../staff/staff-texts';
import { countdownLogText, issueDescription, issueTitle, outcomeText } from './launch-texts';
import { MissionTimePipe } from './mission-time.pipe';

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
  protected readonly scrubCosts = SCRUB_COSTS;

  protected readonly roleLabel = roleLabel;
  protected readonly issueTitle = issueTitle;
  protected readonly issueDescription = issueDescription;
  protected readonly outcomeText = outcomeText;
  protected readonly logText = countdownLogText;
  protected readonly weatherConditionLabel = weatherConditionLabel;

  protected readonly rocketModel = computed(() => this.countdown()?.mission.vehicle ?? null);

  protected readonly successChance = computed(() => {
    const countdown = this.countdown();
    return countdown ? successChance(countdown) : 0;
  });

  /** Everyone in mission control with the verdict of their station; the flight director gives no verdict. */
  protected readonly positions = computed(() => {
    const countdown = this.countdown();
    if (!countdown) {
      return [];
    }
    return CREW_ROLES.map((role) => ({
      role,
      member: countdown.mission.crew[role],
      verdict: role === 'flightDirector' ? null : (countdown.pollResults[role] ?? null)
    }));
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
