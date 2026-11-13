import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import { BuildingsState, ClockState, FinanceState, GuiState, ResearchState } from '../../store';
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
      providers: [provideRouter([]), provideStore([BuildingsState, ClockState, FinanceState, GuiState, ResearchState])]
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ResearchComponent);
    await fixture.whenStable();
  });

  it('offers to build a laboratory', async () => {
    buttonWithText('Labor bauen')!.click();
    await fixture.whenStable();

    expect(store.selectSnapshot(BuildingsState.buildings)).toHaveLength(1);
    expect(text()).toContain('Stufe 1 ist im Bau');
  });
});
