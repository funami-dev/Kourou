import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import { GAME_TIME_PER_REAL_TIME, MS_PER_DAY } from '../../game/clock/clock.constants';
import { STARTING_BALANCE } from '../../game/economy/economy.constants';
import { TECHNOLOGIES } from '../../game/research/technologies.constants';
import { BuildingsState } from '../buildings';
import { AdvanceClock, ClockState } from '../clock';
import { FinanceState } from '../finance';
import { GuiState } from '../gui';
import { StartResearch } from './research.actions';
import { ResearchState } from './research.state';

const WEATHER_RADAR = TECHNOLOGIES.weatherRadar;

describe('ResearchState', () => {
  let store: Store;

  const progress = () => store.selectSnapshot(ResearchState.progress);
  const giveLaboratoryAndPoints = (): void =>
    store.reset({
      ...store.snapshot(),
      buildings: {
        buildings: [{ type: 'laboratory', constructions: [{ level: 1, startedOnDay: 0, completesOnDay: 0 }] }]
      },
      research: { ...store.snapshot().research, researchPoints: 100 }
    });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideStore([BuildingsState, ClockState, FinanceState, GuiState, ResearchState])]
    });
    store = TestBed.inject(Store);
  });

  it('needs a laboratory for research', () => {
    store.reset({ ...store.snapshot(), research: { ...store.snapshot().research, researchPoints: 100 } });
    store.dispatch(new StartResearch('weatherRadar'));

    expect(progress().activeProject).toBeNull();
  });

  it('pays for the research and unlocks the technology after the research days', () => {
    giveLaboratoryAndPoints();
    store.dispatch(new StartResearch('weatherRadar'));

    expect(store.selectSnapshot(FinanceState.balance)).toBe(STARTING_BALANCE - WEATHER_RADAR.cost);
    expect(progress().researchPoints).toBe(100 - WEATHER_RADAR.researchPointCost);

    for (let day = 0; day < WEATHER_RADAR.researchDays; day++) {
      store.dispatch(new AdvanceClock(MS_PER_DAY / GAME_TIME_PER_REAL_TIME));
    }

    expect(progress().unlockedTechnologies).toEqual(['weatherRadar']);
    expect(store.selectSnapshot(ResearchState.bonuses).weatherHoldDurationFactor).toBe(0.5);
  });
});
