import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import type { Building } from '../game/buildings/building.model';
import { BASE_STAFF_CAPACITY } from '../game/staff/staff.constants';
import { BuildingsState } from './buildings/buildings.state';
import { ClockState } from './clock/clock.state';
import { FinanceState } from './finance/finance.state';
import { GuiState } from './gui/gui.state';
import { ResearchContractsState } from './research-contracts/research-contracts.state';
import { ResearchState } from './research/research.state';
import { selectCountdownBonuses, selectOrderBonuses, selectStaffCapacity } from './spaceport.selectors';

/** Buildings that were finished long ago, one level above their start level each. */
const UPGRADED_BUILDINGS: Building[] = (['assemblyHall', 'port', 'weatherStation', 'accommodation'] as const).map(
  (type) => ({ type, constructions: [{ level: 0, startedOnDay: 0, completesOnDay: 0 }] })
);

describe('spaceport selectors', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideStore([BuildingsState, ClockState, FinanceState, GuiState, ResearchContractsState, ResearchState])
      ]
    });
    store = TestBed.inject(Store);
    store.reset({
      ...store.snapshot(),
      buildings: { buildings: UPGRADED_BUILDINGS },
      research: { ...store.snapshot().research, unlockedTechnologies: ['weatherRadar', 'portLogistics'] }
    });
  });

  it('adds up delivery bonuses from the port and technologies', () => {
    expect(store.selectSnapshot(selectOrderBonuses)).toEqual({
      assemblyDurationFactor: 1,
      shippingDaysSaved: 2 + 3,
      assemblySlots: 2
    });
  });

  it('combines the weather radar and the weather station', () => {
    expect(store.selectSnapshot(selectCountdownBonuses).weatherHoldDurationFactor).toBeCloseTo(0.5 * 0.8);
  });

  it('raises the staff capacity with accommodation', () => {
    expect(store.selectSnapshot(selectStaffCapacity)).toBe(BASE_STAFF_CAPACITY + 4);
  });
});
