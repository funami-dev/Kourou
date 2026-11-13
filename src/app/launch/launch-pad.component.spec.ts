import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import { STARTER_OFFERS } from '../../game/contracts/contracts.constants';
import {
  AcceptContractOffer,
  ClockState,
  ContractsState,
  FinanceState,
  GuiState,
  LaunchState,
  OrderRocket,
  RocketsState
} from '../../store';
import { LaunchPadComponent } from './launch-pad.component';
import { provideCalmMorningInKourou } from './launch.testing';

describe('LaunchPadComponent', () => {
  let fixture: ComponentFixture<LaunchPadComponent>;
  let store: Store;

  const text = (): string => (fixture.nativeElement as HTMLElement).textContent!;
  const buttonWithText = (label: string): HTMLButtonElement | undefined =>
    Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button')).find((button) =>
      button.textContent!.includes(label)
    );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaunchPadComponent],
      providers: [
        provideRouter([]),
        provideStore([ClockState, ContractsState, FinanceState, GuiState, LaunchState, RocketsState]),
        provideCalmMorningInKourou()
      ]
    }).compileComponents();

    store = TestBed.inject(Store);
    store.dispatch(new AcceptContractOffer(STARTER_OFFERS[0]!.id));
    store.dispatch(new OrderRocket('ibis'));
    fixture = TestBed.createComponent(LaunchPadComponent);
    await fixture.whenStable();
  });

  const finishAssembly = async (): Promise<void> => {
    const readyAtMs = store.selectSnapshot(RocketsState.rockets)[0]!.readyAtMs;
    store.reset({ ...store.snapshot(), clock: { ...store.snapshot().clock, gameTimeMs: readyAtMs } });
    await fixture.whenStable();
  };

  it('explains when no rocket is ready for a contract', () => {
    expect(text()).toContain('Keine montierte Rakete');
  });

  it('brings an assembled rocket to the pad and shows the launch conditions', async () => {
    await finishAssembly();

    buttonWithText('Ibis IB-01 auf die Rampe')!.click();
    await fixture.whenStable();

    expect(text()).toContain('Auf der Rampe');
    expect(text()).toContain('Startfenster');
    expect(buttonWithText('Countdown starten')!.disabled).toBe(false);
  });
});
