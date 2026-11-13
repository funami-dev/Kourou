import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import type { Contract } from '../../game/contracts/contract.model';
import { MAX_CONTRACTS_IN_PROGRESS, STARTER_OFFERS } from '../../game/contracts/contracts.constants';
import { ClockState, ContractsState, FinanceState, GuiState } from '../../store';
import { ContractsComponent } from './contracts.component';

describe('ContractsComponent', () => {
  let fixture: ComponentFixture<ContractsComponent>;
  let store: Store;

  const element = (): HTMLElement => fixture.nativeElement;
  const acceptButtons = (): HTMLButtonElement[] => Array.from(element().querySelectorAll('.offer button'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractsComponent],
      providers: [provideRouter([]), provideStore([ClockState, ContractsState, FinanceState, GuiState])]
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ContractsComponent);
    await fixture.whenStable();
  });

  it('shows the open offers', () => {
    expect(element().querySelectorAll('.offer')).toHaveLength(STARTER_OFFERS.length);
    expect(element().textContent).toContain(STARTER_OFFERS[0]!.customer);
  });

  it('moves an accepted offer to the accepted contracts', async () => {
    acceptButtons()[0]!.click();
    await fixture.whenStable();

    expect(element().querySelectorAll('.offer')).toHaveLength(STARTER_OFFERS.length - 1);
    expect(element().querySelector('.contracts__accepted')?.textContent).toContain(STARTER_OFFERS[0]!.payload.name);
    expect(element().textContent).toContain('In Arbeit');
  });

  it('disables accepting once the limit of contracts in progress is reached', async () => {
    const contractsInProgress: Contract[] = Array.from({ length: MAX_CONTRACTS_IN_PROGRESS }, (_, index) => ({
      ...STARTER_OFFERS[0]!,
      id: 100 + index,
      acceptedOnDay: 1,
      advancePayment: 0,
      status: 'inProgress'
    }));
    const snapshot = store.snapshot();
    store.reset({ ...snapshot, contracts: { ...snapshot.contracts, contracts: contractsInProgress } });
    await fixture.whenStable();

    expect(acceptButtons().every((button) => button.disabled)).toBe(true);
    expect(element().textContent).toContain('Schließe erst einen ab');
  });
});
