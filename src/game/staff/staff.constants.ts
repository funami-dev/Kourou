import type { Euros } from '../economy/economy.constants';
import type { CountdownIssue, Station } from '../launch/launch.model';
import type { CrewMember, CrewRole } from './staff.model';

export const CREW_ROLES: readonly CrewRole[] = [
  'flightDirector',
  'propulsion',
  'guidance',
  'range',
  'weather',
  'flightDynamics'
];

/** Experience points needed for levels 1 to 5. */
export const EXPERIENCE_LEVEL_THRESHOLDS: readonly number[] = [0, 3, 7, 12, 18];
export const MAX_EXPERIENCE_LEVEL = EXPERIENCE_LEVEL_THRESHOLDS.length;

/** Experience points everyone on a station gains with each finished countdown, scrubs included. */
export const EXPERIENCE_PER_COUNTDOWN = 1;
export const QUICK_LEARNER_EXPERIENCE_FACTOR = 2;

// Balancing values. First estimates, to be tuned with play experience.

/** Daily salary: experienced staff earn more. */
export const BASE_SALARY_PER_DAY: Euros = 8_000;
export const SALARY_INCREASE_PER_LEVEL: Euros = 4_000;

/** One-off cost of hiring, in daily salaries of the new member (job ads, interviews, relocation). */
export const RECRUITING_FEE_IN_DAILY_SALARIES = 10;

/** How many people the spaceport can house without accommodation buildings. */
export const BASE_STAFF_CAPACITY = 8;

/** Candidates come and go: one new application per day, each stays open for a week. */
export const MAX_CANDIDATES = 4;
export const NEW_CANDIDATES_PER_DAY = 1;
export const CANDIDATE_AVAILABILITY_DAYS = 7;
/** Applicants bring between 0 and this many experience points (up to level 3). */
export const MAX_CANDIDATE_EXPERIENCE_POINTS = 11;
/** Share of applicants with a special trait. */
export const CANDIDATE_TRAIT_CHANCE = 0.5;

/** Each experience level above 1 shortens holds at the station by this share. */
export const HOLD_REDUCTION_PER_LEVEL = 0.08;
/** Each experience level above 1 lowers the risk of carrying on despite a problem by this share. */
export const RISK_REDUCTION_PER_LEVEL = 0.1;
/** An experienced flight director runs a tighter operation: success chance per level above 1. */
export const FLIGHT_DIRECTOR_RELIABILITY_BONUS_PER_LEVEL = 0.005;

export const CALM_HOLD_FACTOR = 0.9;
export const METICULOUS_RISK_FACTOR = 0.75;

/** The station that deals with each countdown issue. */
export const RESPONSIBLE_STATION: Record<CountdownIssue, Station> = {
  boatInRangeZone: 'range',
  sensorAnomaly: 'propulsion',
  upperLevelWinds: 'weather',
  weatherNoGo: 'weather',
  launchWindowClosed: 'flightDynamics'
};

/** A small but complete team for a new game: everyone new to the job. */
export const STARTING_CREW: readonly CrewMember[] = [
  { id: 1, name: 'Camille Durand', role: 'flightDirector', experiencePoints: 0, trait: null },
  { id: 2, name: 'Rafael Moreira', role: 'propulsion', experiencePoints: 0, trait: null },
  { id: 3, name: 'Aiko Tanaka', role: 'guidance', experiencePoints: 0, trait: 'meticulous' },
  { id: 4, name: 'Jonas Becker', role: 'range', experiencePoints: 0, trait: null },
  { id: 5, name: 'Amara Okafor', role: 'weather', experiencePoints: 0, trait: 'calm' },
  { id: 6, name: 'Léa Fontaine', role: 'flightDynamics', experiencePoints: 0, trait: null }
];

/** Fictional first and last names for applicants, from the many countries a spaceport team comes from. */
export const FIRST_NAMES: readonly string[] = [
  'Ana',
  'Ben',
  'Chloé',
  'Daniel',
  'Elif',
  'Felipe',
  'Greta',
  'Hugo',
  'Ines',
  'Jakob',
  'Kemi',
  'Luca',
  'Maya',
  'Nils',
  'Olga',
  'Pierre',
  'Rosa',
  'Samir',
  'Tove',
  'Yara'
];
export const LAST_NAMES: readonly string[] = [
  'Almeida',
  'Bertrand',
  'Costa',
  'Dubois',
  'Eriksen',
  'Fischer',
  'García',
  'Hoang',
  'Ivanova',
  'Jansen',
  'Kowalski',
  'Lefèvre',
  'Mensah',
  'Novak',
  'Oliveira',
  'Petit',
  'Rossi',
  'Schmidt',
  'Toure',
  'Weber'
];
