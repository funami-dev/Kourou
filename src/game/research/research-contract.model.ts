import type { Euros } from '../economy/economy.constants';

/** What a research contract is about. Studies happen in the lab, experiments fly into space. */
export type ResearchTopic =
  | 'materialsStudy'
  | 'trajectoryAnalysis'
  | 'propulsionTest'
  | 'microgravityExperiment'
  | 'radiationExperiment'
  | 'biologyExperiment';

/** What the client pays and what the spaceport learns. */
export interface ResearchTerms {
  /** Name of the (fictional) client. Not translated. */
  client: string;
  topic: ResearchTopic;
  payment: Euros;
  researchPoints: number;
}

/** How the research is carried out. */
export type ResearchOfferAssignment =
  | { kind: 'groundStudy'; studyDays: number }
  | { kind: 'flightExperiment'; massKg: number; deadlineDay: number };

export interface ResearchOffer {
  id: number;
  terms: ResearchTerms;
  assignment: ResearchOfferAssignment;
  /** Last game day on which the offer can be accepted. */
  offerExpiresOnDay: number;
}

/** An accepted study occupies a lab slot until it is done; an experiment waits for a launch to ride along. */
export type ResearchContractAssignment =
  | { kind: 'groundStudy'; completesOnDay: number }
  | { kind: 'flightExperiment'; massKg: number; deadlineDay: number };

/** `lost`: the experiment was on board of a failed launch. */
export type ResearchContractStatus = 'inProgress' | 'completed' | 'lost' | 'missedDeadline';

export interface ResearchContract {
  id: number;
  terms: ResearchTerms;
  assignment: ResearchContractAssignment;
  acceptedOnDay: number;
  status: ResearchContractStatus;
}

export interface ResearchContractMarket {
  offers: ResearchOffer[];
  contracts: ResearchContract[];
  nextId: number;
}
