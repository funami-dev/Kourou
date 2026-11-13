import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import { NEW_GAME_LEDGER } from '../../game/economy/ledger';
import { BuildingsState, ClockState, FinanceState, GuiState, ResearchState, RocketsState } from '../../store';
import { RocketsComponent } from './rockets.component';

describe('RocketsComponent', () => {
  let fixture: ComponentFixture<RocketsComponent>;
  let store: Store;

  const element = (): HTMLElement => fixture.nativeElement;
  const orderButtons = (): HTMLButtonElement[] => Array.from(element().querySelectorAll('.rocket-model button'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RocketsComponent],
      providers: [
        provideRouter([]),
        provideStore([BuildingsState, ClockState, FinanceState, GuiState, ResearchState, RocketsState])
      ]
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(RocketsComponent);
    await fixture.whenStable();
  });

  it('shows the rocket catalogue', () => {
    expect(element().querySelectorAll('.rocket-model')).toHaveLength(2);
    expect(element().textContent).toContain('Ibis');
    expect(element().textContent).toContain('Albatros');
  });

  it('shows an ordered rocket on its way by ship', async () => {
    orderButtons()[0]!.click();
    await fixture.whenStable();

    const entry = element().querySelector('.fleet-entry');
    expect(entry?.textContent).toContain('Ibis IB-01');
    expect(entry?.textContent).toContain('Unterwegs per Schiff');
  });

  it('does not let the player order a rocket they cannot afford', async () => {
    store.reset({ ...store.snapshot(), finance: { ...NEW_GAME_LEDGER, balance: 1_000_000 } });
    await fixture.whenStable();

    expect(orderButtons().every((button) => button.disabled)).toBe(true);
    expect(element().textContent).toContain('Nicht genug Geld');
  });
});
