import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { dispatch, select } from '@ngxs/store';

import { LAUNCH_WINDOWS, PAD_FEE_PER_DAY } from '../../game/launch/launch.constants';
import { rocketsAvailableFor } from '../../game/launch/launch-campaign';
import {
  canStartCountdownNow,
  launchWindowClosingMs,
  nextLaunchWindowOpeningMs
} from '../../game/launch/launch-window';
import { assessLaunchWeather } from '../../game/launch/launch-weather';
import { LiveConditionsService } from '../../game/live-conditions/live-conditions.service';
import { selectRideshareExperiments } from '../../game/research/research-contracts';
import { rocketDisplayName } from '../../game/rockets/rocket-fleet';
import { ROCKET_MODELS } from '../../game/rockets/rockets.constants';
import { unstaffedRoles } from '../../game/staff/staff';
import {
  ClockState,
  ContractsState,
  LaunchState,
  MoveRocketToPad,
  RemoveRocketFromPad,
  ResearchContractsState,
  RocketsState,
  StaffState,
  StartCountdown
} from '../../store';
import { orbitLabel, payloadTypeLabel } from '../contracts/contract-labels';
import { EurosPipe } from '../shared/euros.pipe';
import { SiteLocalTimePipe } from '../shared/site-local-time.pipe';
import { researchTopicName } from '../research/research-texts';
import { roleLabel } from '../staff/staff-texts';
import { weatherConstraintText } from './launch-texts';

/** Prepares launches: brings a rocket to the pad for a contract and starts the countdown when conditions allow. */
@Component({
  selector: 'app-launch-pad',
  imports: [DecimalPipe, MatButtonModule, MatIconModule, RouterLink, EurosPipe, SiteLocalTimePipe],
  templateUrl: './launch-pad.component.html',
  styleUrl: './launch-pad.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'game-page' }
})
export class LaunchPadComponent {
  private readonly router = inject(Router);
  private readonly liveConditions = inject(LiveConditionsService);

  private readonly contracts = select(ContractsState.contracts);
  private readonly rockets = select(RocketsState.rockets);
  private readonly gameTimeMs = select(ClockState.gameTimeMs);
  private readonly researchContracts = select(ResearchContractsState.contracts);
  private readonly staffMembers = select(StaffState.members);
  /** Positions in mission control nobody covers; the countdown needs all of them. */
  protected readonly unstaffedRoles = computed(() => unstaffedRoles(this.staffMembers()));
  protected readonly roleLabel = roleLabel;
  protected readonly campaign = select(LaunchState.campaign);
  protected readonly isCountdownOpen = select(LaunchState.isCountdownOpen);

  protected readonly site = this.liveConditions.site;
  protected readonly padFeePerDay = PAD_FEE_PER_DAY;
  protected readonly orbitLabel = orbitLabel;
  protected readonly payloadTypeLabel = payloadTypeLabel;
  protected readonly rocketDisplayName = rocketDisplayName;
  protected readonly weatherConstraintText = weatherConstraintText;
  protected readonly researchTopicName = researchTopicName;

  /** Contracts waiting for a launch, each with the rockets that could carry its payload. */
  protected readonly contractsWaitingForLaunch = computed(() =>
    this.contracts()
      .filter((contract) => contract.status === 'inProgress' && contract.id !== this.campaign()?.contractId)
      .map((contract) => ({
        contract,
        availableRockets: rocketsAvailableFor(contract, this.rockets(), this.campaign(), this.gameTimeMs())
      }))
  );

  /** Everything about the rocket on the pad: what it carries, the launch window and the weather verdict. */
  protected readonly pad = computed(() => {
    const campaign = this.campaign();
    const contract = this.contracts().find(({ id }) => id === campaign?.contractId);
    const rocket = this.rockets().find(({ id }) => id === campaign?.rocketId);
    if (!contract || !rocket) {
      return null;
    }

    const orbit = contract.payload.targetOrbit;
    const nowMs = this.liveConditions.nowMs();
    const rocketModel = ROCKET_MODELS[rocket.modelId];
    const spareCapacityKg = rocketModel.payloadCapacityKg[orbit] - contract.payload.massKg;
    return {
      contract,
      rocket,
      rocketModel,
      launchWindow: LAUNCH_WINDOWS[orbit],
      windowClosesAtMs: launchWindowClosingMs(this.site(), orbit, nowMs),
      windowOpensAtMs: nextLaunchWindowOpeningMs(this.site(), orbit, nowMs),
      canStartCountdown: canStartCountdownNow(this.site(), orbit, nowMs),
      weather: this.liveConditions.weather(),
      weatherAssessment: assessLaunchWeather(this.liveConditions.weather(), rocketModel),
      spareCapacityKg,
      rideshareExperiments: selectRideshareExperiments(this.researchContracts(), spareCapacityKg)
    };
  });

  protected readonly moveRocketToPad = dispatch(MoveRocketToPad);
  protected readonly removeRocketFromPad = dispatch(RemoveRocketFromPad);
  private readonly dispatchStartCountdown = dispatch(StartCountdown);

  protected startCountdown(): void {
    this.dispatchStartCountdown().subscribe(() => void this.router.navigate(['/game/countdown']));
  }

  protected formatHour(hour: number): string {
    return `${(hour % 24).toString().padStart(2, '0')}:00`;
  }
}
