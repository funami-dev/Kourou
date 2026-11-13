import type { Technology, TechnologyBranch, TechnologyId } from './technology.model';

// Balancing values. First estimates, to be tuned with play experience.
// A free lab slot produces 3 research points a day, so a first-tier technology takes about ten days of lab work.

const FIRST_TIER = { researchPointCost: 30, cost: 2_000_000, researchDays: 4 } as const;
const SECOND_TIER = { researchPointCost: 60, cost: 4_000_000, researchDays: 6 } as const;

export const TECHNOLOGIES: Record<TechnologyId, Technology> = {
  weatherRadar: {
    id: 'weatherRadar',
    branch: 'launchOperations',
    prerequisites: [],
    ...FIRST_TIER,
    // Better short-term forecasts: the weather team knows sooner whether waiting is worth it.
    effect: { kind: 'shorterWeatherHolds', holdDurationFactor: 0.5 }
  },
  rangeSurveillance: {
    id: 'rangeSurveillance',
    branch: 'launchOperations',
    prerequisites: ['weatherRadar'],
    ...SECOND_TIER,
    // The radar also watches the sea: boats are turned away long before the countdown.
    effect: { kind: 'preventCountdownIssue', issue: 'boatInRangeZone' }
  },
  qualityAssurance: {
    id: 'qualityAssurance',
    branch: 'reliability',
    prerequisites: [],
    ...FIRST_TIER,
    effect: { kind: 'higherReliability', reliabilityBonus: 0.02 }
  },
  redundantSensors: {
    id: 'redundantSensors',
    branch: 'reliability',
    prerequisites: ['qualityAssurance'],
    ...SECOND_TIER,
    // With every measurement taken twice, a single faulty sensor no longer stops the countdown.
    effect: { kind: 'preventCountdownIssue', issue: 'sensorAnomaly' }
  },
  modularAssembly: {
    id: 'modularAssembly',
    branch: 'infrastructure',
    prerequisites: [],
    ...FIRST_TIER,
    effect: { kind: 'fasterAssembly', assemblyDurationFactor: 0.7 }
  },
  portLogistics: {
    id: 'portLogistics',
    branch: 'infrastructure',
    prerequisites: ['modularAssembly'],
    ...SECOND_TIER,
    effect: { kind: 'fasterShipping', shippingDaysSaved: 3 }
  }
};

/** Order of the branches in the technology tree. */
export const TECHNOLOGY_BRANCHES: readonly TechnologyBranch[] = ['launchOperations', 'reliability', 'infrastructure'];
