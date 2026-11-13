import type { Euros } from '../economy/economy.constants';
import type { ResearchOffer, ResearchTopic } from './research-contract.model';

// Balancing values. First estimates, to be tuned with play experience.

interface Range {
  min: number;
  max: number;
}

/** Typical size of each kind of research. Flight experiments pay more, because they need a launch. */
export const RESEARCH_TOPIC_PROFILES: Record<
  ResearchTopic,
  { payment: Range; researchPoints: Range } & (
    | { kind: 'groundStudy'; studyDays: Range }
    | { kind: 'flightExperiment'; massKg: Range }
  )
> = {
  materialsStudy: {
    kind: 'groundStudy',
    studyDays: { min: 4, max: 8 },
    payment: { min: 600_000, max: 1_200_000 },
    researchPoints: { min: 8, max: 15 }
  },
  trajectoryAnalysis: {
    kind: 'groundStudy',
    studyDays: { min: 3, max: 6 },
    payment: { min: 400_000, max: 900_000 },
    researchPoints: { min: 6, max: 12 }
  },
  propulsionTest: {
    kind: 'groundStudy',
    studyDays: { min: 6, max: 10 },
    payment: { min: 1_000_000, max: 2_000_000 },
    researchPoints: { min: 12, max: 20 }
  },
  microgravityExperiment: {
    kind: 'flightExperiment',
    massKg: { min: 20, max: 80 },
    payment: { min: 1_500_000, max: 3_000_000 },
    researchPoints: { min: 15, max: 30 }
  },
  radiationExperiment: {
    kind: 'flightExperiment',
    massKg: { min: 10, max: 50 },
    payment: { min: 1_000_000, max: 2_500_000 },
    researchPoints: { min: 15, max: 25 }
  },
  biologyExperiment: {
    kind: 'flightExperiment',
    massKg: { min: 15, max: 60 },
    payment: { min: 1_200_000, max: 2_800_000 },
    researchPoints: { min: 20, max: 35 }
  }
};

/** Fictional clients and the research they commission. */
export const RESEARCH_CLIENTS: readonly { name: string; topics: readonly ResearchTopic[] }[] = [
  { name: 'Institut Lumen', topics: ['radiationExperiment', 'trajectoryAnalysis'] },
  { name: 'Hochschule Sylvana', topics: ['biologyExperiment', 'materialsStudy'] },
  { name: 'Kessling Werkstofftechnik', topics: ['materialsStudy', 'microgravityExperiment'] },
  { name: 'Fennek Raumfahrttechnik', topics: ['propulsionTest', 'microgravityExperiment'] }
];

/** Payments are rounded to this step, so offers read like real-world prices. */
export const RESEARCH_PAYMENT_ROUNDING_STEP: Euros = 100_000;

/** How many days an offer can be accepted, including the day it appears. */
export const RESEARCH_OFFER_VALIDITY_DAYS = 5;

/** Days between the day an experiment offer appears and its launch deadline. */
export const MIN_DAYS_UNTIL_EXPERIMENT_DEADLINE = 25;
export const MAX_DAYS_UNTIL_EXPERIMENT_DEADLINE = 45;

export const MAX_OPEN_RESEARCH_OFFERS = 3;
export const NEW_RESEARCH_OFFERS_PER_DAY = 1;

/** Experiments waiting for a launch at the same time. Studies are limited by the lab slots instead. */
export const MAX_FLIGHT_EXPERIMENTS_IN_PROGRESS = 3;

/** Handpicked offers for a new game: one study and one experiment, so both kinds are visible from the start. */
export const STARTER_RESEARCH_OFFERS: readonly ResearchOffer[] = [
  {
    id: 1,
    terms: { client: 'Kessling Werkstofftechnik', topic: 'materialsStudy', payment: 800_000, researchPoints: 10 },
    assignment: { kind: 'groundStudy', studyDays: 5 },
    offerExpiresOnDay: 10
  },
  {
    id: 2,
    terms: { client: 'Institut Lumen', topic: 'radiationExperiment', payment: 1_600_000, researchPoints: 20 },
    assignment: { kind: 'flightExperiment', massKg: 30, deadlineDay: 40 },
    offerExpiresOnDay: 10
  }
];
