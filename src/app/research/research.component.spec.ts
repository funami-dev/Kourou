import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import { BuildingsState, ClockState, FinanceState, GuiState, ResearchContractsState, ResearchState } from '../../store';
import { ResearchComponent } from './research.component';

describe('ResearchComponent', () => {
  let fixture: ComponentFixture<ResearchComponent>;
  let store: Store;

  const text = (): string => (fixture.nativeElement as HTMLElement).textContent!;
  const buttonWithText = (label: string): HTMLButtonElement | undefined =>
    Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button')).find((button) =>
      button.textContent!.includes(label)
    );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResearchComponent],
      providers: [
        provideRouter([]),
        provideStore([BuildingsState, ClockState, FinanceState, GuiState, ResearchContractsState, ResearchState])
      ]
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ResearchComponent);
    await fixture.whenStable();
  });

  it('shows the technology tree, but research needs a laboratory', () => {
    expect(text()).toContain('Wetterradar');
    expect(text()).toContain('Für eigene Forschung brauchst du ein Labor');
    expect(buttonWithText('Erforschen')!.disabled).toBe(true);
  });

  it('starts researching a technology', async () => {
    store.reset({
      ...store.snapshot(),
      buildings: {
        buildings: [{ type: 'laboratory', constructions: [{ level: 1, startedOnDay: 0, completesOnDay: 0 }] }]
      },
      research: { ...store.snapshot().research, researchPoints: 100 }
    });
    await fixture.whenStable();

    buttonWithText('Erforschen')!.click();
    await fixture.whenStable();

    expect(store.selectSnapshot(ResearchState.progress).activeProject?.technologyId).toBe('weatherRadar');
    expect(text()).toContain('In Forschung: Wetterradar');
  });

  it('accepts a flight experiment without a laboratory', async () => {
    const experimentButton = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('.research-offer button')
    )[1]!;
    experimentButton.click();
    await fixture.whenStable();

    expect(store.selectSnapshot(ResearchContractsState.contracts)).toHaveLength(1);
    expect(text()).toContain('Wartet auf einen Start');
  });

  it('offers to build a laboratory', async () => {
    buttonWithText('Labor bauen')!.click();
    await fixture.whenStable();

    expect(store.selectSnapshot(BuildingsState.buildings)).toHaveLength(1);
    expect(text()).toContain('Stufe 1 ist im Bau');
  });
});
