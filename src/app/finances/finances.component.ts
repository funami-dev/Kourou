import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { select } from '@ngxs/store';

import { DAILY_OPERATING_COSTS } from '../../game/economy/economy.constants';
import { summarize } from '../../game/economy/ledger';
import { FinanceState } from '../../store';
import { EurosPipe } from '../shared/euros.pipe';
import { GameDateTimePipe } from '../shared/game-date-time.pipe';
import { transactionCategoryLabel } from './transaction-category-label';

/** Overview of the spaceport's money: balance, income, expenses and the most recent transactions. */
@Component({
  selector: 'app-finances',
  imports: [EurosPipe, GameDateTimePipe],
  templateUrl: './finances.component.html',
  styleUrl: './finances.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'game-page' }
})
export class FinancesComponent {
  protected readonly balance = select(FinanceState.balance);
  protected readonly dailyOperatingCosts = DAILY_OPERATING_COSTS;
  protected readonly categoryLabel = transactionCategoryLabel;

  private readonly transactions = select(FinanceState.transactions);
  protected readonly newestTransactionsFirst = computed(() => [...this.transactions()].reverse());
  protected readonly summary = computed(() => summarize(this.transactions()));
}
