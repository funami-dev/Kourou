import type { Euros } from '../economy/economy.constants';
import type { CountdownIssue } from '../launch/launch.model';

export type TechnologyId =
  | 'weatherRadar'
  | 'rangeSurveillance'
  | 'qualityAssurance'
  | 'redundantSensors'
  | 'modularAssembly'
  | 'portLogistics';

/** Areas of the technology tree. */
export type TechnologyBranch = 'launchOperations' | 'reliability' | 'infrastructure';

/** What a technology changes in the game. */
export type TechnologyEffect =
  | { kind: 'shorterWeatherHolds'; holdDurationFactor: number }
  | { kind: 'preventCountdownIssue'; issue: CountdownIssue }
  | { kind: 'higherReliability'; reliabilityBonus: number }
  | { kind: 'fasterAssembly'; assemblyDurationFactor: number }
  | { kind: 'fasterShipping'; shippingDaysSaved: number };

export interface Technology {
  id: TechnologyId;
  branch: TechnologyBranch;
  /** Technologies that must be researched first. */
  prerequisites: readonly TechnologyId[];
  researchPointCost: number;
  /** Money for equipment and materials, paid when the research starts. */
  cost: Euros;
  researchDays: number;
  effect: TechnologyEffect;
}

/** A technology currently being researched. */
export interface ResearchProject {
  technologyId: TechnologyId;
  startedOnDay: number;
  /** From the start of this game day on, the technology is available. */
  completesOnDay: number;
}

/** Everything about the spaceport's own research. */
export interface ResearchProgress {
  /** Research points collected and not yet spent. */
  researchPoints: number;
  unlockedTechnologies: TechnologyId[];
  activeProject: ResearchProject | null;
}

export type TechnologyStatus = 'unlocked' | 'inProgress' | 'available' | 'locked';

/** The combined effect of all unlocked technologies. */
export interface TechnologyBonuses {
  weatherHoldDurationFactor: number;
  preventedCountdownIssues: CountdownIssue[];
  reliabilityBonus: number;
  assemblyDurationFactor: number;
  shippingDaysSaved: number;
}
