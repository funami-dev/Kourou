import { TECHNOLOGIES } from './technologies.constants';
import {
  NEW_GAME_RESEARCH_PROGRESS,
  NO_TECHNOLOGY_BONUSES,
  completeResearchIfDue,
  startResearch,
  technologyBonuses,
  technologyStatus
} from './research';
import type { ResearchProgress } from './technology.model';

const WITH_POINTS: ResearchProgress = { ...NEW_GAME_RESEARCH_PROGRESS, researchPoints: 100 };

describe('technologyStatus', () => {
  it('makes technologies without prerequisites available', () => {
    expect(technologyStatus(WITH_POINTS, 'weatherRadar')).toBe('available');
  });

  it('locks technologies until their prerequisites are researched', () => {
    expect(technologyStatus(WITH_POINTS, 'rangeSurveillance')).toBe('locked');
    expect(technologyStatus({ ...WITH_POINTS, unlockedTechnologies: ['weatherRadar'] }, 'rangeSurveillance')).toBe(
      'available'
    );
  });
});

describe('research projects', () => {
  const started = startResearch(WITH_POINTS, 'weatherRadar', 5)!;
  const finishedOn = 5 + TECHNOLOGIES.weatherRadar.researchDays;

  it('spends research points and runs for some days', () => {
    expect(started.researchPoints).toBe(100 - TECHNOLOGIES.weatherRadar.researchPointCost);
    expect(technologyStatus(started, 'weatherRadar')).toBe('inProgress');
  });

  it('unlocks the technology once the research is done', () => {
    expect(completeResearchIfDue(started, finishedOn - 1)).toBe(started);

    const completed = completeResearchIfDue(started, finishedOn);
    expect(completed.unlockedTechnologies).toEqual(['weatherRadar']);
    expect(completed.activeProject).toBeNull();
  });

  it('runs only one project at a time', () => {
    expect(startResearch(started, 'qualityAssurance', 5)).toBeNull();
  });

  it('needs enough research points', () => {
    expect(startResearch(NEW_GAME_RESEARCH_PROGRESS, 'weatherRadar', 5)).toBeNull();
  });

  it('cannot start a locked technology', () => {
    expect(startResearch(WITH_POINTS, 'redundantSensors', 5)).toBeNull();
  });
});

describe('technologyBonuses', () => {
  it('has no effect without technologies', () => {
    expect(technologyBonuses([])).toEqual(NO_TECHNOLOGY_BONUSES);
  });

  it('combines the effects of all unlocked technologies', () => {
    expect(
      technologyBonuses([
        'weatherRadar',
        'rangeSurveillance',
        'qualityAssurance',
        'redundantSensors',
        'modularAssembly',
        'portLogistics'
      ])
    ).toEqual({
      weatherHoldDurationFactor: 0.5,
      preventedCountdownIssues: ['boatInRangeZone', 'sensorAnomaly'],
      reliabilityBonus: 0.02,
      assemblyDurationFactor: 0.7,
      shippingDaysSaved: 3
    });
  });
});
