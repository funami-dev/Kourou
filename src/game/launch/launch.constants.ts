import { MS_PER_MINUTE } from '../clock/clock.constants';
import type { OrbitType } from '../contracts/contract.model';
import type { Euros } from '../economy/economy.constants';
import type { CountdownIssue, FlightPhase, Milestone } from './launch.model';

const MS_PER_SECOND = 1000;

// Balancing values. These are first estimates and will be tuned with play experience.

/** The countdown starts at T−10:00 and runs in real time. See docs/game-design.md ("Countdown-Dauer"). */
export const COUNTDOWN_START_MISSION_TIME_MS = -10 * MS_PER_MINUTE;
export const COUNTDOWN_DURATION_MS = -COUNTDOWN_START_MISSION_TIME_MS;

/** The fixed countdown script, in mission time (negative = before liftoff). */
export const MILESTONE_TIMES: Record<Milestone, number> = {
  countdownStarted: COUNTDOWN_START_MISSION_TIME_MS,
  propellantLoadingStarted: -9 * MS_PER_MINUTE,
  propellantLoadingCompleted: -5.5 * MS_PER_MINUTE,
  weatherBriefing: -5 * MS_PER_MINUTE,
  goNoGoPoll: -4 * MS_PER_MINUTE,
  terminalCount: -1 * MS_PER_MINUTE,
  liftoff: 0
};

/**
 * Flight phases in mission time after liftoff, roughly as for a real launch to orbit.
 * The flight is shown faster than real time (see FLIGHT_TIME_ACCELERATION), so it takes about 1.5 minutes.
 */
export const FLIGHT_PHASE_TIMES: Record<FlightPhase, number> = {
  towerCleared: 10 * MS_PER_SECOND,
  maxQ: 72 * MS_PER_SECOND,
  stageSeparation: 150 * MS_PER_SECOND,
  fairingSeparation: 210 * MS_PER_SECOND,
  orbitInsertion: 540 * MS_PER_SECOND
};

export const FLIGHT_TIME_ACCELERATION = 6;

/** Random issues that can come up during the countdown. */
export const RANDOM_ISSUES: readonly CountdownIssue[] = ['boatInRangeZone', 'sensorAnomaly', 'upperLevelWinds'];

/** Each countdown brings 1 to 2 random issues, between these mission times. */
export const MIN_RANDOM_ISSUES = 1;
export const MAX_RANDOM_ISSUES = 2;
export const RANDOM_ISSUES_EARLIEST_MS = -8.5 * MS_PER_MINUTE;
export const RANDOM_ISSUES_LATEST_MS = -2 * MS_PER_MINUTE;

/** How long a hold lasts until the issue is resolved (or the weather is checked again). */
export const HOLD_DURATION_MS: Record<Exclude<CountdownIssue, 'launchWindowClosed'>, number> = {
  boatInRangeZone: 60 * MS_PER_SECOND,
  sensorAnomaly: 90 * MS_PER_SECOND,
  upperLevelWinds: 2 * MS_PER_MINUTE,
  weatherNoGo: 2 * MS_PER_MINUTE
};

/**
 * How much continuing despite an issue lowers the chance of success.
 * Issues missing here cannot be ignored: a boat in the range zone or a closed launch window is a hard "no go".
 */
export const RISK_OF_CONTINUING: Partial<Record<CountdownIssue, number>> = {
  sensorAnomaly: 0.03,
  upperLevelWinds: 0.05
};

/** Risk of launching against a "no go" from the weather station. */
export const WEATHER_RISK = {
  thunderstorm: 0.25,
  windGusts: 0.1
} as const;

/**
 * Simplified launch windows: the local time span at the launch site in which a launch to the orbit is possible.
 * Real launch windows depend on the exact target orbit; these spans only capture the typical pattern
 * (e.g. launches to GTO from Kourou usually take place in the evening).
 */
export const LAUNCH_WINDOWS: Record<OrbitType, { opensAtLocalHour: number; closesAtLocalHour: number }> = {
  leo: { opensAtLocalHour: 6, closesAtLocalHour: 22 },
  sso: { opensAtLocalHour: 18, closesAtLocalHour: 6 },
  gto: { opensAtLocalHour: 16, closesAtLocalHour: 24 }
};

/** Fee for each game day a rocket occupies the launch pad. */
export const PAD_FEE_PER_DAY: Euros = 50_000;

/** Costs of calling off a countdown: draining propellant, resetting the pad, overtime. */
export const SCRUB_COSTS: Euros = 300_000;

/** Repairs to the launch pad and its surroundings after a failed launch. */
export const PAD_REPAIR_COSTS_AFTER_FAILURE: Euros = 2_000_000;
