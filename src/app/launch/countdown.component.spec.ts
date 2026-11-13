import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import { NO_TECHNOLOGY_BONUSES } from '../../game/research/research';
import { createCountdown } from '../../game/launch/countdown';
import type { Countdown } from '../../game/launch/launch.model';
import { GuiState, LaunchState, NEW_GAME_LAUNCH } from '../../store';
import type { LaunchResult } from '../../store';
import { CountdownComponent } from './countdown.component';
import { provideCalmMorningInKourou } from './launch.testing';

describe('CountdownComponent', () => {
  let fixture: ComponentFixture<CountdownComponent>;
  let store: Store;

  const element = (): HTMLElement => fixture.nativeElement;
  const buttonWithText = (label: string): HTMLButtonElement | undefined =>
    Array.from(element().querySelectorAll('button')).find((button) => button.textContent!.includes(label));

  const freshCountdown = (): Countdown =>
    createCountdown(
      {
        campaign: { contractId: 1, rocketId: 1 },
        rocketModelId: 'ibis',
        targetOrbit: 'leo',
        bonuses: NO_TECHNOLOGY_BONUSES,
        rideshareContractIds: []
      },
      () => 0
    );

  async function showCountdown(countdown: Countdown, lastResult: LaunchResult | null = null): Promise<void> {
    store.reset({ ...store.snapshot(), launch: { ...NEW_GAME_LAUNCH, countdown, lastResult } });
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountdownComponent],
      providers: [provideRouter([]), provideStore([GuiState, LaunchState]), provideCalmMorningInKourou()]
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(CountdownComponent);
    await fixture.whenStable();
  });

  it('shows the launch clock', async () => {
    await showCountdown(freshCountdown());

    expect(element().querySelector('.countdown__clock')?.textContent).toContain('T−10:00');
  });

  it('asks the team to decide on an issue', async () => {
    await showCountdown({
      ...freshCountdown(),
      status: { kind: 'awaitingDecision', issue: 'sensorAnomaly', riskIfContinued: 0.03 }
    });

    expect(element().textContent).toContain('Sensoranomalie');
    buttonWithText('Halten')!.click();
    await fixture.whenStable();

    expect(store.selectSnapshot(LaunchState.countdown)?.status.kind).toBe('holding');
  });

  it('shows the result when the launch is over', async () => {
    await showCountdown(
      { ...freshCountdown(), status: { kind: 'finished', outcome: 'success' } },
      {
        outcome: 'success',
        customer: 'Institut Lumen',
        payloadName: 'Lumen-1',
        rocketName: 'Ibis IB-01',
        income: 8_100_000,
        costs: 0,
        reputationChange: 5,
        rideshareExperiments: 0
      }
    );

    expect(element().textContent).toContain('Mission erfolgreich!');
    expect(buttonWithText('Zurück zur Startrampe')).toBeDefined();
  });
});
