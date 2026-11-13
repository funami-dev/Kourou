import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { dispatch, select } from '@ngxs/store';

import { designBlueprintId } from '../../game/rockets/rocket-design';
import type { RocketModel } from '../../game/rockets/rocket.model';
import {
  endOfCurrentStepMs,
  progressOfCurrentStep,
  rocketDisplayName,
  rocketStatus
} from '../../game/rockets/rocket-fleet';
import { ROCKET_MODELS, SHIP_DELIVERY_DAYS } from '../../game/rockets/rockets.constants';
import { ClockState, FinanceState, OrderRocket, RocketsState, selectOrderBonuses } from '../../store';
import { GameDateTimePipe } from '../shared/game-date-time.pipe';
import { RocketDesignerComponent } from './rocket-designer/rocket-designer.component';
import { RocketModelCardComponent } from './rocket-model-card/rocket-model-card.component';
import { rocketStatusLabel } from './rocket-status-label';

/** Rocket catalogue to buy from, and the player's own rockets with their delivery and assembly progress. */
@Component({
  selector: 'app-rockets',
  imports: [MatButtonModule, MatProgressBarModule, GameDateTimePipe, RocketDesignerComponent, RocketModelCardComponent],
  templateUrl: './rockets.component.html',
  styleUrl: './rockets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'game-page' }
})
export class RocketsComponent {
  private readonly balance = select(FinanceState.balance);
  private readonly rockets = select(RocketsState.rockets);
  private readonly nowMs = select(ClockState.gameTimeMs);
  private readonly blueprints = select(RocketsState.blueprints);
  private readonly designs = select(RocketsState.designs);
  private readonly orderBonuses = select(selectOrderBonuses);
  protected readonly launchExperience = select(RocketsState.launchExperience);

  /** Delivery time including the port and port logistics. */
  protected readonly shipDeliveryDays = computed(() => SHIP_DELIVERY_DAYS - this.orderBonuses().shippingDaysSaved);
  protected readonly assemblySlots = computed(() => this.orderBonuses().assemblySlots);

  /** Catalogue models with the spaceport's experience taken into account. */
  protected readonly catalogue = computed(() =>
    (Object.keys(ROCKET_MODELS) as (keyof typeof ROCKET_MODELS)[])
      .map((id) => this.blueprints()[id])
      .filter((model): model is RocketModel => model !== undefined)
  );

  protected readonly ownDesigns = computed(() =>
    this.designs()
      .map((design) => this.blueprints()[designBlueprintId(design.id)])
      .filter((model): model is RocketModel => model !== undefined)
  );

  /** The player's rockets, prepared for display. */
  protected readonly fleet = computed(() =>
    this.rockets().map((rocket) => {
      const status = rocketStatus(rocket, this.nowMs());
      return {
        rocket,
        name: rocketDisplayName(rocket, this.blueprints()),
        status,
        statusLabel: rocketStatusLabel(status),
        progressPercent: Math.round(progressOfCurrentStep(rocket, this.nowMs()) * 100),
        currentStepEndsAtMs: endOfCurrentStepMs(rocket, this.nowMs())
      };
    })
  );

  private readonly dispatchOrder = dispatch(OrderRocket);

  protected canAfford(model: RocketModel): boolean {
    return this.balance() >= model.price;
  }

  protected order(model: RocketModel): void {
    this.dispatchOrder(model.id);
  }
}
