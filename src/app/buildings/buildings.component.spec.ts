import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import { BuildingsState, ClockState, FinanceState, GuiState } from '../../store';
import { BuildingsComponent } from './buildings.component';

describe('BuildingsComponent', () => {
  let fixture: ComponentFixture<BuildingsComponent>;
  let store: Store;

  const cardOf = (name: string): HTMLElement =>
    Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.building-card')).find((card) =>
      card.querySelector('h2')!.textContent!.includes(name)
    )!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingsComponent],
      providers: [provideRouter([]), provideStore([BuildingsState, ClockState, FinanceState, GuiState])]
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(BuildingsComponent);
    await fixture.whenStable();
  });

  it('shows the buildings every spaceport starts with', () => {
    expect(cardOf('Montagehalle').textContent).toContain('Stufe 1 / 3');
    expect(cardOf('Wetterstation').textContent).toContain('Stufe 0 / 2');
  });

  it('upgrades a building', async () => {
    cardOf('Montagehalle').querySelector('button')!.click();
    await fixture.whenStable();

    expect(store.selectSnapshot(BuildingsState.buildings)).toHaveLength(1);
    expect(cardOf('Montagehalle').textContent).toContain('Stufe 2 ist im Bau');
  });
});
