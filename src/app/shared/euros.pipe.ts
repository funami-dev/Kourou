import { LOCALE_ID, Pipe, inject } from '@angular/core';
import type { PipeTransform } from '@angular/core';
import { formatCurrency } from '@angular/common';

import type { Euros } from '../../game/economy/economy.constants';

/**
 * Formats an amount of money in the current locale, without cents, e.g. "100.000.000 €".
 * Cents are irrelevant at the scale of a spaceport and would only add noise.
 */
@Pipe({ name: 'euros' })
export class EurosPipe implements PipeTransform {
  private readonly locale = inject(LOCALE_ID);

  transform(amount: Euros, options: { showPlusSign?: boolean } = {}): string {
    const formatted = formatCurrency(amount, this.locale, '€', 'EUR', '1.0-0');
    return options.showPlusSign && amount > 0 ? `+${formatted}` : formatted;
  }
}
