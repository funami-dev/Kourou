import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import { GAME_TIME_PER_REAL_TIME, MS_PER_DAY } from '../../game/clock/clock.constants';
import {
  BUILDING_LEVELS,
  RESEARCH_POINTS_PER_FREE_LAB_SLOT_PER_DAY,
  UPKEEP_PER_LEVEL_PER_DAY
} from '../../game/buildings/buildings.constants';
import { NEW_GAME_LEDGER } from '../../game/economy/ledger';
import { STARTING_BALANCE } from '../../game/economy/economy.constants';
import { AdvanceClock, ClockState } from '../clock';
import { FinanceState } from '../finance';
import { GuiState } from '../gui';
import { ResearchContractsState } from '../research-contracts';
import { ResearchState } from '../research';
import { StartBuildingConstruction } from './buildings.actions';
import { BuildingsState } from './buildings.state';

const LAB_LEVEL_1 = BUILDING_LEVELS.laboratory[0]!;

describe('BuildingsState', () => {
  let store: Store;

  const balance = (): number => store.selectSnapshot(FinanceState.balance);
  const passDays = (days: number): void => {
    for (let day = 0; day < days; day++) {
      store.dispatch(new AdvanceClock(MS_PER_DAY / GAME_TIME_PER_REAL_TIME));
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideStore([BuildingsState, ClockState, FinanceState, GuiState, ResearchContractsState, ResearchState])
      ]
    });
    store = TestBed.inject(Store);
  });

  it('builds a laboratory and pays for it', () => {
    store.dispatch(new StartBuildingConstruction('laboratory'));

    expect(store.selectSnapshot(BuildingsState.buildings)).toHaveLength(1);
    expect(balance()).toBe(STARTING_BALANCE - LAB_LEVEL_1.cost);
  });

  it('refuses to build without enough money', () => {
    store.reset({ ...store.snapshot(), finance: { ...NEW_GAME_LEDGER, balance: 1_000 } });
    store.dispatch(new StartBuildingConstruction('laboratory'));

    expect(store.selectSnapshot(BuildingsState.buildings)).toEqual([]);
  });

  it('produces research points and costs upkeep once the laboratory is finished', () => {
    store.dispatch(new StartBuildingConstruction('laboratory'));
    passDays(LAB_LEVEL_1.constructionDays);
    expect(store.selectSnapshot(ResearchState.researchPoints)).toBe(RESEARCH_POINTS_PER_FREE_LAB_SLOT_PER_DAY);
    expect(store.selectSnapshot(FinanceState.transactions)).toContainEqual(
      expect.objectContaining({ category: 'buildingUpkeep', amount: -UPKEEP_PER_LEVEL_PER_DAY.laboratory })
    );

    passDays(1);
    expect(store.selectSnapshot(ResearchState.researchPoints)).toBe(2 * RESEARCH_POINTS_PER_FREE_LAB_SLOT_PER_DAY);
    expect(store.selectSnapshot(ClockState.currentDay)).toBe(1 + LAB_LEVEL_1.constructionDays + 1);
  });
});
