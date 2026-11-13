import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { dispatch, select } from '@ngxs/store';

import { advancePaymentFor } from '../../game/contracts/contract-market';
import { MAX_CONTRACTS_IN_PROGRESS } from '../../game/contracts/contracts.constants';
import { AcceptContractOffer, ClockState, ContractsState } from '../../store';
import { EurosPipe } from '../shared/euros.pipe';
import { contractStatusLabel, orbitLabel, payloadTypeLabel } from './contract-labels';

/** Lists the open offers from customers and the contracts the player has accepted. */
@Component({
  selector: 'app-contracts',
  imports: [DecimalPipe, MatButtonModule, EurosPipe],
  templateUrl: './contracts.component.html',
  styleUrl: './contracts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'game-page' }
})
export class ContractsComponent {
  protected readonly offers = select(ContractsState.offers);
  protected readonly contracts = select(ContractsState.contracts);
  protected readonly canAcceptMoreContracts = select(ContractsState.canAcceptMoreContracts);
  protected readonly today = select(ClockState.currentDay);
  protected readonly maxContractsInProgress = MAX_CONTRACTS_IN_PROGRESS;

  protected readonly orbitLabel = orbitLabel;
  protected readonly payloadTypeLabel = payloadTypeLabel;
  protected readonly contractStatusLabel = contractStatusLabel;
  protected readonly advancePaymentFor = advancePaymentFor;

  protected readonly acceptOffer = dispatch(AcceptContractOffer);
}
