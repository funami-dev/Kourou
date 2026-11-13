import type { LaunchSite } from '../launch-sites/launch-site.model';
import { pickRandom, randomIntegerBetween } from '../random';
import type { RandomNumberGenerator } from '../random';
import { ROCKET_MODELS } from '../rockets/rockets.constants';
import type { WeatherReport } from '../weather/weather.model';
import {
  COUNTDOWN_START_MISSION_TIME_MS,
  FLIGHT_PHASE_TIMES,
  FLIGHT_TIME_ACCELERATION,
  HOLD_DURATION_MS,
  MAX_RANDOM_ISSUES,
  MILESTONE_TIMES,
  MIN_RANDOM_ISSUES,
  RANDOM_ISSUES,
  RANDOM_ISSUES_EARLIEST_MS,
  RANDOM_ISSUES_LATEST_MS,
  RISK_OF_CONTINUING
} from './launch.constants';
import type {
  Countdown,
  CountdownDecision,
  CountdownIssue,
  CountdownLogMessage,
  CountdownStatus,
  FlightPhase,
  LaunchMission,
  Milestone,
  Station,
  TimelineEvent,
  Verdict
} from './launch.model';
import { isLaunchWindowOpen } from './launch-window';
import { assessLaunchWeather } from './launch-weather';

/** The real-world situation the countdown reacts to. */
export interface LaunchConditions {
  site: LaunchSite;
  weather: WeatherReport;
  /** Current real time (epoch ms). */
  nowMs: number;
}

const FLIGHT_PHASES = Object.keys(FLIGHT_PHASE_TIMES) as FlightPhase[];

/** Starts a countdown at T−10:00 with the fixed script and 1–2 random issues. */
export function createCountdown(mission: LaunchMission, random: RandomNumberGenerator): Countdown {
  const timeline: TimelineEvent[] = [
    ...(Object.entries(MILESTONE_TIMES) as [Milestone, number][]).map(
      ([milestone, atMissionTimeMs]): TimelineEvent => ({ kind: 'milestone', milestone, atMissionTimeMs })
    ),
    ...randomIssues(random),
    ...(Object.entries(FLIGHT_PHASE_TIMES) as [FlightPhase, number][]).map(
      ([phase, atMissionTimeMs]): TimelineEvent => ({ kind: 'flightPhase', phase, atMissionTimeMs })
    )
  ].sort((first, second) => first.atMissionTimeMs - second.atMissionTimeMs);

  return {
    mission,
    missionTimeMs: COUNTDOWN_START_MISSION_TIME_MS,
    status: { kind: 'counting' },
    timeline,
    nextEventIndex: 0,
    pollResults: {},
    acceptedRisk: 0,
    failsAtPhase: null,
    log: []
  };
}

function randomIssues(random: RandomNumberGenerator): TimelineEvent[] {
  const numberOfIssues = randomIntegerBetween(random, MIN_RANDOM_ISSUES, MAX_RANDOM_ISSUES);
  const remainingIssues = [...RANDOM_ISSUES];

  return Array.from({ length: numberOfIssues }, (): TimelineEvent => {
    const issue = pickRandom(random, remainingIssues);
    remainingIssues.splice(remainingIssues.indexOf(issue), 1);
    const atMissionTimeMs = randomIntegerBetween(random, RANDOM_ISSUES_EARLIEST_MS, RANDOM_ISSUES_LATEST_MS);
    return { kind: 'issue', issue, atMissionTimeMs };
  });
}

export function isCountdownFinished(countdown: Countdown): boolean {
  return countdown.status.kind === 'finished';
}

/**
 * Lets real time pass in the countdown: the clock runs, holds wear off, and scripted and random events happen.
 * Stops early when an event needs a decision from the launch team.
 */
export function advanceCountdown(
  countdown: Countdown,
  realElapsedMs: number,
  conditions: LaunchConditions,
  random: RandomNumberGenerator
): Countdown {
  let current = countdown;
  let remainingRealMs = realElapsedMs;

  while (remainingRealMs > 0) {
    const { status } = current;

    if (status.kind === 'holding') {
      const holdTimePassed = Math.min(remainingRealMs, status.remainingHoldMs);
      remainingRealMs -= holdTimePassed;
      current = { ...current, status: { ...status, remainingHoldMs: status.remainingHoldMs - holdTimePassed } };
      if (status.remainingHoldMs === holdTimePassed) {
        current = endHold(current, status.issue, conditions);
      }
      continue;
    }

    if (status.kind !== 'counting') {
      break;
    }

    // After liftoff the flight is shown faster than real time.
    const missionSpeed = current.missionTimeMs >= 0 ? FLIGHT_TIME_ACCELERATION : 1;
    const targetMissionTimeMs = current.missionTimeMs + remainingRealMs * missionSpeed;
    const nextEvent = current.timeline[current.nextEventIndex];

    if (!nextEvent || nextEvent.atMissionTimeMs > targetMissionTimeMs) {
      current = { ...current, missionTimeMs: targetMissionTimeMs };
      remainingRealMs = 0;
    } else {
      remainingRealMs -= (nextEvent.atMissionTimeMs - current.missionTimeMs) / missionSpeed;
      current = {
        ...current,
        missionTimeMs: nextEvent.atMissionTimeMs,
        nextEventIndex: current.nextEventIndex + 1
      };
      current = handleEvent(current, nextEvent, conditions, random);
    }
  }

  return current;
}

/** The choices the launch team has in the current situation. */
export function availableDecisions(status: CountdownStatus): CountdownDecision[] {
  if (status.kind !== 'awaitingDecision') {
    return [];
  }
  if (status.issue === 'launchWindowClosed') {
    return ['scrub'];
  }
  return status.riskIfContinued === null ? ['hold', 'scrub'] : ['hold', 'continue', 'scrub'];
}

/** Applies the launch team's decision on the issue the countdown is waiting for. */
export function decideOnIssue(countdown: Countdown, decision: CountdownDecision): Countdown {
  const { status } = countdown;
  if (status.kind !== 'awaitingDecision' || !availableDecisions(status).includes(decision)) {
    return countdown;
  }

  const logged = withLog(countdown, { kind: 'decision', issue: status.issue, decision });

  switch (decision) {
    case 'hold':
      return {
        ...logged,
        status: {
          kind: 'holding',
          issue: status.issue,
          // A hold is never offered for a closed launch window (see availableDecisions).
          remainingHoldMs: HOLD_DURATION_MS[status.issue as keyof typeof HOLD_DURATION_MS]
        }
      };
    case 'continue':
      return {
        ...logged,
        status: { kind: 'counting' },
        acceptedRisk: logged.acceptedRisk + (status.riskIfContinued ?? 0)
      };
    case 'scrub':
      return finish(logged, 'scrubbed');
  }
}

function handleEvent(
  countdown: Countdown,
  event: TimelineEvent,
  conditions: LaunchConditions,
  random: RandomNumberGenerator
): Countdown {
  switch (event.kind) {
    case 'milestone':
      return handleMilestone(countdown, event.milestone, conditions, random);
    case 'issue':
      return withLog(
        { ...countdown, status: awaitingDecisionOn(event.issue, RISK_OF_CONTINUING[event.issue] ?? null) },
        { kind: 'issue', issue: event.issue }
      );
    case 'flightPhase':
      return handleFlightPhase(countdown, event.phase);
  }
}

function handleMilestone(
  countdown: Countdown,
  milestone: Milestone,
  conditions: LaunchConditions,
  random: RandomNumberGenerator
): Countdown {
  const logged = withLog(countdown, { kind: 'milestone', milestone });

  switch (milestone) {
    case 'goNoGoPoll':
      return runGoNoGoPoll(logged, conditions);
    case 'liftoff':
      return { ...logged, failsAtPhase: rollForFailure(logged, random) };
    default:
      return logged;
  }
}

/**
 * Every station reports. Propulsion, guidance and range have already raised their problems as issues,
 * so they report "go"; weather and flight dynamics check the live conditions.
 */
function runGoNoGoPoll(countdown: Countdown, conditions: LaunchConditions): Countdown {
  const weatherAssessment = assessLaunchWeather(conditions.weather, ROCKET_MODELS[countdown.mission.rocketModelId]);
  const isWindowOpenAtLiftoff = isWindowOpenAtLiftoffFor(countdown, conditions);

  const verdicts: Record<Station, Verdict> = {
    propulsion: 'go',
    guidance: 'go',
    range: 'go',
    weather: weatherAssessment.verdict,
    flightDynamics: isWindowOpenAtLiftoff ? 'go' : 'noGo'
  };

  let polled: Countdown = { ...countdown, pollResults: verdicts };
  for (const [station, verdict] of Object.entries(verdicts) as [Station, Verdict][]) {
    polled = withLog(polled, { kind: 'poll', station, verdict });
  }

  if (!isWindowOpenAtLiftoff) {
    return withIssue(polled, 'launchWindowClosed', null);
  }
  if (weatherAssessment.verdict === 'noGo') {
    return withIssue(polled, 'weatherNoGo', weatherAssessment.riskIfIgnored);
  }
  return polled;
}

/** After a hold: the weather is checked again, other issues are resolved. */
function endHold(countdown: Countdown, issue: CountdownIssue, conditions: LaunchConditions): Countdown {
  if (issue === 'weatherNoGo') {
    const assessment = assessLaunchWeather(conditions.weather, ROCKET_MODELS[countdown.mission.rocketModelId]);
    const polled = withLog(
      { ...countdown, pollResults: { ...countdown.pollResults, weather: assessment.verdict } },
      { kind: 'poll', station: 'weather', verdict: assessment.verdict }
    );
    if (assessment.verdict === 'noGo') {
      return withIssue(polled, 'weatherNoGo', assessment.riskIfIgnored);
    }
    return resumeCounting(polled, issue, conditions);
  }

  return resumeCounting(countdown, issue, conditions);
}

/** Holds push liftoff back, so after the poll the launch window has to be checked again before counting on. */
function resumeCounting(countdown: Countdown, resolvedIssue: CountdownIssue, conditions: LaunchConditions): Countdown {
  const resolved = withLog(
    { ...countdown, status: { kind: 'counting' } },
    { kind: 'issueResolved', issue: resolvedIssue }
  );
  const pollIsDone = resolved.pollResults.flightDynamics !== undefined;

  if (pollIsDone && !isWindowOpenAtLiftoffFor(resolved, conditions)) {
    return withIssue(
      { ...resolved, pollResults: { ...resolved.pollResults, flightDynamics: 'noGo' } },
      'launchWindowClosed',
      null
    );
  }
  return resolved;
}

function isWindowOpenAtLiftoffFor(countdown: Countdown, conditions: LaunchConditions): boolean {
  const liftoffAtMs = conditions.nowMs - countdown.missionTimeMs;
  return isLaunchWindowOpen(conditions.site, countdown.mission.targetOrbit, liftoffAtMs);
}

/** Decides at liftoff whether the flight fails, and if so in which phase. */
function rollForFailure(countdown: Countdown, random: RandomNumberGenerator): FlightPhase | null {
  const successChance = ROCKET_MODELS[countdown.mission.rocketModelId].reliability - countdown.acceptedRisk;
  return random() < successChance ? null : pickRandom(random, FLIGHT_PHASES);
}

function handleFlightPhase(countdown: Countdown, phase: FlightPhase): Countdown {
  if (countdown.failsAtPhase === phase) {
    return finish(withLog(countdown, { kind: 'anomaly', phase }), 'failure');
  }

  const logged = withLog(countdown, { kind: 'flightPhase', phase });
  return phase === 'orbitInsertion' ? finish(logged, 'success') : logged;
}

function withIssue(countdown: Countdown, issue: CountdownIssue, riskIfContinued: number | null): Countdown {
  return withLog({ ...countdown, status: awaitingDecisionOn(issue, riskIfContinued) }, { kind: 'issue', issue });
}

function awaitingDecisionOn(issue: CountdownIssue, riskIfContinued: number | null): CountdownStatus {
  return { kind: 'awaitingDecision', issue, riskIfContinued };
}

function finish(countdown: Countdown, outcome: 'success' | 'failure' | 'scrubbed'): Countdown {
  return withLog({ ...countdown, status: { kind: 'finished', outcome } }, { kind: 'outcome', outcome });
}

function withLog(countdown: Countdown, message: CountdownLogMessage): Countdown {
  return { ...countdown, log: [...countdown.log, { ...message, missionTimeMs: countdown.missionTimeMs }] };
}
