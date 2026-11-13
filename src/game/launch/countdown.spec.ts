import { MS_PER_MINUTE } from '../clock/clock.constants';
import { LAUNCH_SITES } from '../launch-sites/launch-sites.constants';
import { typicalWeather } from '../weather/typical-weather';
import type { RandomNumberGenerator } from '../random';
import { advanceCountdown, availableDecisions, createCountdown, decideOnIssue, isCountdownFinished } from './countdown';
import type { LaunchConditions } from './countdown';
import {
  FLIGHT_PHASE_TIMES,
  FLIGHT_TIME_ACCELERATION,
  HOLD_DURATION_MS,
  RANDOM_ISSUES_EARLIEST_MS,
  RISK_OF_CONTINUING,
  WEATHER_RISK
} from './launch.constants';
import type { Countdown, CountdownIssue, LaunchMission, TimelineEvent } from './launch.model';

const kourou = LAUNCH_SITES.kourou;
/** 10:00 local time in Kourou (UTC−3), in the dry season: the LEO launch window is open, the weather calm. */
const MORNING_IN_KOUROU = Date.UTC(2026, 8, 15, 13, 0);

const calmConditions: LaunchConditions = {
  site: kourou,
  weather: typicalWeather(kourou, MORNING_IN_KOUROU),
  nowMs: MORNING_IN_KOUROU
};
const thunderstormConditions: LaunchConditions = {
  ...calmConditions,
  weather: { ...calmConditions.weather, condition: 'thunderstorm' }
};

const leoMission: LaunchMission = {
  campaign: { contractId: 1, rocketId: 1 },
  rocketModelId: 'ibis',
  targetOrbit: 'leo'
};

/** Random numbers that make every roll succeed and pick the first option. */
const lowestRandom: RandomNumberGenerator = () => 0;
/** Random numbers that make the launch fail. */
const highestRandom: RandomNumberGenerator = () => 0.999;

const TEN_MINUTES = 10 * MS_PER_MINUTE;
const FLIGHT_DURATION_REAL_MS = FLIGHT_PHASE_TIMES.orbitInsertion / FLIGHT_TIME_ACCELERATION;

/** A countdown with the given random issues instead of rolled ones. */
function countdownWithIssues(issues: { issue: CountdownIssue; atMissionTimeMs: number }[] = []): Countdown {
  const countdown = createCountdown(leoMission, lowestRandom);
  const timeline: TimelineEvent[] = [
    ...countdown.timeline.filter((event) => event.kind !== 'issue'),
    ...issues.map(({ issue, atMissionTimeMs }): TimelineEvent => ({ kind: 'issue', issue, atMissionTimeMs }))
  ].sort((first, second) => first.atMissionTimeMs - second.atMissionTimeMs);
  return { ...countdown, timeline };
}

describe('createCountdown', () => {
  it('starts at T−10:00 with at least one random issue', () => {
    const countdown = createCountdown(leoMission, lowestRandom);

    expect(countdown.missionTimeMs).toBe(-TEN_MINUTES);
    expect(countdown.timeline).toContainEqual({
      kind: 'issue',
      issue: 'boatInRangeZone',
      atMissionTimeMs: RANDOM_ISSUES_EARLIEST_MS
    });
  });

  it('keeps the timeline in chronological order', () => {
    const times = createCountdown(leoMission, () => 0.7).timeline.map((event) => event.atMissionTimeMs);

    expect(times).toEqual([...times].sort((first, second) => first - second));
  });
});

describe('advanceCountdown', () => {
  it('runs through the script and the poll when nothing goes wrong', () => {
    const countdown = advanceCountdown(countdownWithIssues(), TEN_MINUTES, calmConditions, lowestRandom);

    expect(countdown.missionTimeMs).toBe(0);
    expect(countdown.status).toEqual({ kind: 'counting' });
    expect(countdown.pollResults).toEqual({
      propulsion: 'go',
      guidance: 'go',
      range: 'go',
      weather: 'go',
      flightDynamics: 'go'
    });
    expect(countdown.log.at(-1)).toEqual({ kind: 'milestone', milestone: 'liftoff', missionTimeMs: 0 });
  });

  it('flies faster than real time and reaches orbit', () => {
    const atLiftoff = advanceCountdown(countdownWithIssues(), TEN_MINUTES, calmConditions, lowestRandom);
    const inOrbit = advanceCountdown(atLiftoff, FLIGHT_DURATION_REAL_MS, calmConditions, lowestRandom);

    expect(inOrbit.status).toEqual({ kind: 'finished', outcome: 'success' });
    expect(inOrbit.log.map((entry) => entry.kind)).toContain('flightPhase');
  });

  it('can fail during the flight', () => {
    const atLiftoff = advanceCountdown(countdownWithIssues(), TEN_MINUTES, calmConditions, highestRandom);
    const afterFlight = advanceCountdown(atLiftoff, FLIGHT_DURATION_REAL_MS, calmConditions, highestRandom);

    expect(atLiftoff.failsAtPhase).not.toBeNull();
    expect(afterFlight.status).toEqual({ kind: 'finished', outcome: 'failure' });
    expect(afterFlight.log).toContainEqual(expect.objectContaining({ kind: 'anomaly', phase: atLiftoff.failsAtPhase }));
  });

  it('stops at an issue until the team decides', () => {
    const issueAt = -7 * MS_PER_MINUTE;
    const countdown = advanceCountdown(
      countdownWithIssues([{ issue: 'sensorAnomaly', atMissionTimeMs: issueAt }]),
      TEN_MINUTES,
      calmConditions,
      lowestRandom
    );

    expect(countdown.missionTimeMs).toBe(issueAt);
    expect(countdown.status).toEqual({
      kind: 'awaitingDecision',
      issue: 'sensorAnomaly',
      riskIfContinued: RISK_OF_CONTINUING.sensorAnomaly
    });
  });
});

describe('decisions', () => {
  const issueAt = -7 * MS_PER_MINUTE;
  const stoppedAtSensorAnomaly = advanceCountdown(
    countdownWithIssues([{ issue: 'sensorAnomaly', atMissionTimeMs: issueAt }]),
    TEN_MINUTES,
    calmConditions,
    lowestRandom
  );

  it('holds the clock and resumes once the issue is resolved', () => {
    const holding = decideOnIssue(stoppedAtSensorAnomaly, 'hold');
    const resumed = advanceCountdown(holding, HOLD_DURATION_MS.sensorAnomaly + 1_000, calmConditions, lowestRandom);

    expect(holding.status.kind).toBe('holding');
    expect(resumed.status).toEqual({ kind: 'counting' });
    expect(resumed.missionTimeMs).toBe(issueAt + 1_000);
    expect(resumed.log).toContainEqual(expect.objectContaining({ kind: 'issueResolved', issue: 'sensorAnomaly' }));
  });

  it('accepts the risk when continuing', () => {
    const continued = decideOnIssue(stoppedAtSensorAnomaly, 'continue');

    expect(continued.status).toEqual({ kind: 'counting' });
    expect(continued.acceptedRisk).toBe(RISK_OF_CONTINUING.sensorAnomaly);
  });

  it('ends the countdown when scrubbing', () => {
    expect(isCountdownFinished(decideOnIssue(stoppedAtSensorAnomaly, 'scrub'))).toBe(true);
  });

  it('offers no way to ignore a boat in the range zone', () => {
    const stoppedAtBoat = advanceCountdown(
      countdownWithIssues([{ issue: 'boatInRangeZone', atMissionTimeMs: issueAt }]),
      TEN_MINUTES,
      calmConditions,
      lowestRandom
    );

    expect(availableDecisions(stoppedAtBoat.status)).toEqual(['hold', 'scrub']);
    expect(decideOnIssue(stoppedAtBoat, 'continue')).toBe(stoppedAtBoat);
  });
});

describe('go/no-go poll', () => {
  it('stops for a thunderstorm and lets the team wait for better weather', () => {
    const noGo = advanceCountdown(countdownWithIssues(), TEN_MINUTES, thunderstormConditions, lowestRandom);
    expect(noGo.status).toEqual({
      kind: 'awaitingDecision',
      issue: 'weatherNoGo',
      riskIfContinued: WEATHER_RISK.thunderstorm
    });

    const holding = decideOnIssue(noGo, 'hold');
    const stillStormy = advanceCountdown(holding, HOLD_DURATION_MS.weatherNoGo, thunderstormConditions, lowestRandom);
    expect(stillStormy.status.kind).toBe('awaitingDecision');

    const clearedUp = advanceCountdown(
      decideOnIssue(stillStormy, 'hold'),
      HOLD_DURATION_MS.weatherNoGo,
      calmConditions,
      lowestRandom
    );
    expect(clearedUp.status).toEqual({ kind: 'counting' });
    expect(clearedUp.pollResults.weather).toBe('go');
  });

  it('only allows a scrub when the launch window is closed at liftoff', () => {
    // 21:57 local time: liftoff after the poll at T−4:00 would be at 22:01, after the LEO window closes.
    const lateEvening = Date.UTC(2026, 8, 16, 0, 57);
    const countdown = advanceCountdown(
      countdownWithIssues(),
      TEN_MINUTES,
      { ...calmConditions, nowMs: lateEvening, weather: typicalWeather(kourou, lateEvening) },
      lowestRandom
    );

    expect(countdown.status).toMatchObject({ kind: 'awaitingDecision', issue: 'launchWindowClosed' });
    expect(availableDecisions(countdown.status)).toEqual(['scrub']);
    expect(countdown.pollResults.flightDynamics).toBe('noGo');
  });
});
