import type { Station } from '../launch/launch.model';

/** Positions in mission control: the flight director leads, one specialist runs each station. */
export type CrewRole = 'flightDirector' | Station;

/**
 * Personal strengths:
 * calm people shorten holds, meticulous people reduce the risk of carrying on despite a problem,
 * quick learners gain experience twice as fast.
 */
export type CrewTrait = 'calm' | 'meticulous' | 'quickLearner';

export interface CrewMember {
  id: number;
  /** Fictional name. Not translated. */
  name: string;
  role: CrewRole;
  /** Grows with every countdown; determines the experience level (1–5). */
  experiencePoints: number;
  trait: CrewTrait | null;
}

/** Someone who has applied for a job at the spaceport. */
export interface Candidate extends CrewMember {
  /** Last game day on which the candidate can be hired. */
  availableUntilDay: number;
}

export interface Staff {
  members: CrewMember[];
  candidates: Candidate[];
  nextId: number;
}

/** Who sits at which position during a countdown, as copied when the countdown starts. */
export type StationCrew = Record<CrewRole, StationCrewMember>;

export interface StationCrewMember {
  memberId: number;
  name: string;
  /** Experience level including training bonuses (1–5). */
  level: number;
  trait: CrewTrait | null;
}
