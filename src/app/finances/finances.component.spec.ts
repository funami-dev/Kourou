import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import { BookTransaction, ClockState, FinanceState, GuiState } from '../../store';
import { FinancesComponent } from './finances.component';

describe('FinancesComponent', () => {
  let fixture: ComponentFixture<FinancesComponent>;
  let store: Store;

  const rows = (): string[] =>
    Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('tbody tr')).map((row) =>
      row.textContent!.replace(/\s+/g, ' ').trim()
    );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancesComponent],
      providers: [provideRouter([]), provideStore([ClockState, FinanceState, GuiState])]
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(FinancesComponent);
    await fixture.whenStable();
  });

  it('explains when there are no transactions yet', () => {
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Noch keine Buchungen');
  });

  it('lists transactions with the newest first', async () => {
    store.dispatch(new BookTransaction(-250_000, 'operatingCosts'));
    store.dispatch(new BookTransaction(1_000_000, 'stateGrant'));
    await fixture.whenStable();

    expect(rows()).toHaveLength(2);
    expect(rows()[0]).toContain('Staatliche Förderung');
    expect(rows()[1]).toContain('Betriebskosten');
  });
});
