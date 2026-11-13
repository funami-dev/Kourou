import type { OrbitType } from '../contracts/contract.model';
import type { TechnologyBonuses } from '../research/technology.model';
import type { RocketModelId } from '../rockets/rocket.model';
import type { StationCrew } from '../staff/staff.model';

/** A rocket standing on the launch pad, ready to launch the payload of a contract. */
export interface LaunchCampaign {
  contractId: number;
  rocketId: number;
}

/** Technology bonuses that change how a countdown goes. */
export type CountdownBonuses = Pick<
  TechnologyBonuses,
  'weatherHoldDurationFactor' | 'preventedCountdownIssues' | 'reliabilityBonus'
>;

/** Facts about the launch the countdown needs, copied when the countdown starts. */
export interface LaunchMission {
  campaign: LaunchCampaign;
  rocketModelId: RocketModelId;
  targetOrbit: OrbitType;
  bonuses: CountdownBonuses;
  /** Research experiments riding along with the main payload. */
  rideshareContractIds: number[];
  /** Who sits at which position in mission control. */
  crew: StationCrew;
}

/** Positions in mission control that report "go" or "no go" in the poll before launch. */
export type Station = 'propulsion' | 'guidance' | 'range' | 'weather' | 'flightDynamics';

export type Verdict = 'go' | 'noGo';

/** Fixed steps of the countdown script. */
export type Milestone =
  | 'countdownStarted'
  | 'propellantLoadingStarted'
  | 'propellantLoadingCompleted'
  | 'weatherBriefing'
  | 'goNoGoPoll'
  | 'terminalCount'
  | 'liftoff';

/** Steps of the flight after liftoff. */
export type FlightPhase = 'towerCleared' | 'maxQ' | 'stageSeparation' | 'fairingSeparation' | 'orbitInsertion';

/** Problems during the countdown that stop it until the launch team decides what to do. */
export type CountdownIssue =
  | 'boatInRangeZone'
  | 'sensorAnomaly'
  | 'upperLevelWinds'
  | 'weatherNoGo'
  | 'launchWindowClosed';

/** What the launch team can do about an issue. */
export type CountdownDecision = 'hold' | 'continue' | 'scrub';

export type LaunchOutcome = 'success' | 'failure' | 'scrubbed';

export type CountdownStatus =
  | { kind: 'counting' }
  | { kind: 'awaitingDecision'; issue: CountdownIssue; riskIfContinued: number | null }
  | { kind: 'holding'; issue: CountdownIssue; remainingHoldMs: number }
  | { kind: 'finished'; outcome: LaunchOutcome };

/** Something that happens at a fixed point of the mission timeline. */
export type TimelineEvent =
  | { kind: 'milestone'; milestone: Milestone; atMissionTimeMs: number }
  | { kind: 'issue'; issue: CountdownIssue; atMissionTimeMs: number }
  | { kind: 'flightPhase'; phase: FlightPhase; atMissionTimeMs: number };

/** What mission control reports in the log. */
export type CountdownLogMessage =
  | { kind: 'milestone'; milestone: Milestone }
  | { kind: 'poll'; station: Station; verdict: Verdict }
  | { kind: 'issue'; issue: CountdownIssue }
  | { kind: 'decision'; issue: CountdownIssue; decision: CountdownDecision }
  | { kind: 'issueResolved'; issue: CountdownIssue }
  | { kind: 'flightPhase'; phase: FlightPhase }
  | { kind: 'anomaly'; phase: FlightPhase }
  | { kind: 'outcome'; outcome: LaunchOutcome };

/** A line in the mission control log ("radio protocol"), stamped with the mission time. */
export type CountdownLogEntry = CountdownLogMessage & { missionTimeMs: number };

/**
 * A running countdown and flight.
 * The mission time runs from T−10:00 (negative) through liftoff (0) to orbit insertion (positive).
 */
export interface Countdown {
  mission: LaunchMission;
  missionTimeMs: number;
  status: CountdownStatus;
  /** All scripted and random events, sorted by time. */
  timeline: TimelineEvent[];
  nextEventIndex: number;
  /** Station verdicts of the latest go/no-go poll. */
  pollResults: Partial<Record<Station, Verdict>>;
  /** Reduction of the launch success chance from risks the team accepted. */
  acceptedRisk: number;
  /** Decided at liftoff: the flight phase in which the rocket fails, or `null` for a successful flight. */
  failsAtPhase: FlightPhase | null;
  log: CountdownLogEntry[];
}
