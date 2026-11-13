import type { Euros } from '../economy/economy.constants';
import type { CountdownIssue } from '../launch/launch.model';
import { pickRandom } from '../random';
import type { RandomNumberGenerator } from '../random';
import {
  BASE_SALARY_PER_DAY,
  CALM_HOLD_FACTOR,
  CANDIDATE_AVAILABILITY_DAYS,
  CANDIDATE_TRAIT_CHANCE,
  CREW_ROLES,
  EXPERIENCE_LEVEL_THRESHOLDS,
  EXPERIENCE_PER_COUNTDOWN,
  FIRST_NAMES,
  FLIGHT_DIRECTOR_RELIABILITY_BONUS_PER_LEVEL,
  HOLD_REDUCTION_PER_LEVEL,
  LAST_NAMES,
  MAX_CANDIDATE_EXPERIENCE_POINTS,
  MAX_CANDIDATES,
  MAX_EXPERIENCE_LEVEL,
  METICULOUS_RISK_FACTOR,
  NEW_CANDIDATES_PER_DAY,
  QUICK_LEARNER_EXPERIENCE_FACTOR,
  RECRUITING_FEE_IN_DAILY_SALARIES,
  RESPONSIBLE_STATION,
  RISK_REDUCTION_PER_LEVEL,
  SALARY_INCREASE_PER_LEVEL,
  STARTING_CREW
} from './staff.constants';
import type { Candidate, CrewMember, CrewRole, CrewTrait, Staff, StationCrew, StationCrewMember } from './staff.model';

const CREW_TRAITS: readonly CrewTrait[] = ['calm', 'meticulous', 'quickLearner'];

export const NEW_GAME_STAFF: Staff = {
  members: [...STARTING_CREW],
  candidates: [],
  nextId: STARTING_CREW.length + 1
};

/** Experience level (1–5) for the given experience points. */
export function experienceLevel(experiencePoints: number): number {
  return EXPERIENCE_LEVEL_THRESHOLDS.filter((threshold) => experiencePoints >= threshold).length;
}

export function dailySalary(member: CrewMember): Euros {
  return BASE_SALARY_PER_DAY + SALARY_INCREASE_PER_LEVEL * (experienceLevel(member.experiencePoints) - 1);
}

export function totalDailySalaries(members: readonly CrewMember[]): Euros {
  return members.reduce((sum, member) => sum + dailySalary(member), 0);
}

export function recruitingFee(candidate: Candidate): Euros {
  return dailySalary(candidate) * RECRUITING_FEE_IN_DAILY_SALARIES;
}

/**
 * Who takes each position in a countdown: the most experienced member of each role.
 * Returns `null` if a role is not covered, because a countdown needs every position staffed.
 *
 * @param levelBonus extra levels from training facilities (control center), capped at the top level
 */
export function assembleStationCrew(members: readonly CrewMember[], levelBonus = 0): StationCrew | null {
  const entries = CREW_ROLES.map((role): [CrewRole, StationCrewMember | null] => {
    const best = members
      .filter((member) => member.role === role)
      .sort((first, second) => second.experiencePoints - first.experiencePoints)[0];
    if (!best) {
      return [role, null];
    }
    const level = Math.min(MAX_EXPERIENCE_LEVEL, experienceLevel(best.experiencePoints) + levelBonus);
    return [role, { memberId: best.id, name: best.name, level, trait: best.trait }];
  });

  if (entries.some(([, crewMember]) => crewMember === null)) {
    return null;
  }
  return Object.fromEntries(entries) as StationCrew;
}

/** Roles nobody covers, so the countdown cannot start. */
export function unstaffedRoles(members: readonly CrewMember[]): CrewRole[] {
  return CREW_ROLES.filter((role) => !members.some((member) => member.role === role));
}

/** How long a hold for the issue lasts compared to the base duration, depending on who handles it. */
export function crewHoldFactor(crew: StationCrew, issue: CountdownIssue): number {
  const responsible = crew[RESPONSIBLE_STATION[issue]];
  const experienceFactor = 1 - HOLD_REDUCTION_PER_LEVEL * (responsible.level - 1);
  return experienceFactor * (responsible.trait === 'calm' ? CALM_HOLD_FACTOR : 1);
}

/** How risky carrying on despite the issue is compared to the base risk, depending on who assesses it. */
export function crewRiskFactor(crew: StationCrew, issue: CountdownIssue): number {
  const responsible = crew[RESPONSIBLE_STATION[issue]];
  const experienceFactor = 1 - RISK_REDUCTION_PER_LEVEL * (responsible.level - 1);
  return experienceFactor * (responsible.trait === 'meticulous' ? METICULOUS_RISK_FACTOR : 1);
}

export function flightDirectorReliabilityBonus(crew: StationCrew): number {
  return FLIGHT_DIRECTOR_RELIABILITY_BONUS_PER_LEVEL * (crew.flightDirector.level - 1);
}

/** Everyone who sat at a position during a countdown gains experience. */
export function gainCountdownExperience(staff: Staff, crew: StationCrew): Staff {
  const memberIds = Object.values(crew).map(({ memberId }) => memberId);
  return {
    ...staff,
    members: staff.members.map((member) => {
      if (!memberIds.includes(member.id)) {
        return member;
      }
      const factor = member.trait === 'quickLearner' ? QUICK_LEARNER_EXPERIENCE_FACTOR : 1;
      return { ...member, experiencePoints: member.experiencePoints + EXPERIENCE_PER_COUNTDOWN * factor };
    })
  };
}

/** Hires a candidate. Returns `null` if the candidate is gone or the spaceport is full. */
export function hireCandidate(staff: Staff, candidateId: number, staffCapacity: number): Staff | null {
  const candidate = staff.candidates.find(({ id }) => id === candidateId);
  if (!candidate || staff.members.length >= staffCapacity) {
    return null;
  }
  const member: CrewMember = {
    id: candidate.id,
    name: candidate.name,
    role: candidate.role,
    experiencePoints: candidate.experiencePoints,
    trait: candidate.trait
  };
  return {
    ...staff,
    members: [...staff.members, member],
    candidates: staff.candidates.filter(({ id }) => id !== candidateId)
  };
}

export function dismissMember(staff: Staff, memberId: number): Staff {
  return { ...staff, members: staff.members.filter(({ id }) => id !== memberId) };
}

/** Each morning, old applications expire and new ones arrive. */
export function updateCandidates(staff: Staff, day: number, random: RandomNumberGenerator): Staff {
  let updated: Staff = {
    ...staff,
    candidates: staff.candidates.filter((candidate) => candidate.availableUntilDay >= day)
  };
  const numberOfNewCandidates = Math.min(NEW_CANDIDATES_PER_DAY, MAX_CANDIDATES - updated.candidates.length);

  for (let index = 0; index < numberOfNewCandidates; index++) {
    const candidate = generateCandidate(updated.nextId, day, random);
    updated = { ...updated, candidates: [...updated.candidates, candidate], nextId: updated.nextId + 1 };
  }
  return updated;
}

export function generateCandidate(id: number, day: number, random: RandomNumberGenerator): Candidate {
  return {
    id,
    name: `${pickRandom(random, FIRST_NAMES)} ${pickRandom(random, LAST_NAMES)}`,
    role: pickRandom(random, CREW_ROLES),
    // Squaring the random number makes experienced applicants rarer than newcomers.
    experiencePoints: Math.floor(random() ** 2 * (MAX_CANDIDATE_EXPERIENCE_POINTS + 1)),
    trait: random() < CANDIDATE_TRAIT_CHANCE ? pickRandom(random, CREW_TRAITS) : null,
    availableUntilDay: day + CANDIDATE_AVAILABILITY_DAYS - 1
  };
}
