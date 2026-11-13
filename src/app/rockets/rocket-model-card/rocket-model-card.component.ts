import { DecimalPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import type { OrbitType } from '../../../game/contracts/contract.model';
import type { RocketModel } from '../../../game/rockets/rocket.model';
import { orbitShortLabel } from '../../contracts/contract-labels';
import { EurosPipe } from '../../shared/euros.pipe';

const ORBITS: readonly OrbitType[] = ['leo', 'sso', 'gto'];

/** Key figures of a rocket type – catalogue model or own design – with a button to order one. */
@Component({
  selector: 'app-rocket-model-card',
  imports: [DecimalPipe, PercentPipe, MatButtonModule, EurosPipe],
  templateUrl: './rocket-model-card.component.html',
  styleUrl: './rocket-model-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RocketModelCardComponent {
  readonly model = input.required<RocketModel>();
  readonly canAfford = input.required<boolean>();
  /** Successful launches so far; shown for own designs, whose reliability grows with them. */
  readonly successfulLaunches = input(0);
  readonly order = output<RocketModel>();

  protected readonly orbits = ORBITS;
  protected readonly orbitShortLabel = orbitShortLabel;
}
