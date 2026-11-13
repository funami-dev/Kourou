import { DecimalPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { dispatch, select } from '@ngxs/store';

import type { OrbitType } from '../../game/contracts/contract.model';
import type { RocketModel } from '../../game/rockets/rocket.model';
import { endOfCurrentStepMs, progressOfCurrentStep, rocketStatus } from '../../game/rockets/rocket-fleet';
import { ROCKET_MODELS, SHIP_DELIVERY_DAYS } from '../../game/rockets/rockets.constants';
import { ClockState, FinanceState, OrderRocket, RocketsState } from '../../store';
import { orbitShortLabel } from '../contracts/contract-labels';
import { EurosPipe } from '../shared/euros.pipe';
import { GameDateTimePipe } from '../shared/game-date-time.pipe';
import { rocketStatusLabel } from './rocket-status-label';

const ORBITS: readonly OrbitType[] = ['leo', 'sso', 'gto'];

/** Rocket catalogue to buy from, and the player's own rockets with their delivery and assembly progress. */
@Component({
  selector: 'app-rockets',
  imports: [DecimalPipe, PercentPipe, MatButtonModule, MatProgressBarModule, EurosPipe, GameDateTimePipe],
  templateUrl: './rockets.component.html',
  styleUrl: './rockets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'game-page' }
})
export class RocketsComponent {
  protected readonly rocketModels = Object.values(ROCKET_MODELS);
  protected readonly orbits = ORBITS;
  protected readonly shipDeliveryDays = SHIP_DELIVERY_DAYS;
  protected readonly orbitShortLabel = orbitShortLabel;

  private readonly balance = select(FinanceState.balance);
  private readonly rockets = select(RocketsState.rockets);
  private readonly nowMs = select(ClockState.gameTimeMs);

  /** The player's rockets, prepared for display. */
  protected readonly fleet = computed(() =>
    this.rockets().map((rocket) => {
      const status = rocketStatus(rocket, this.nowMs());
      return {
        rocket,
        model: ROCKET_MODELS[rocket.modelId],
        status,
        statusLabel: rocketStatusLabel(status),
        progressPercent: Math.round(progressOfCurrentStep(rocket, this.nowMs()) * 100),
        currentStepEndsAtMs: endOfCurrentStepMs(rocket, this.nowMs())
      };
    })
  );

  protected readonly orderRocket = dispatch(OrderRocket);

  protected canAfford(model: RocketModel): boolean {
    return this.balance() >= model.price;
  }
}
