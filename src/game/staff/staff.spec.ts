import { CALM_HOLD_FACTOR, MAX_EXPERIENCE_LEVEL, STARTING_CREW } from './staff.constants';
import {
  NEW_GAME_STAFF,
  assembleStationCrew,
  crewHoldFactor,
  crewRiskFactor,
  dailySalary,
  dismissMember,
  experienceLevel,
  flightDirectorReliabilityBonus,
  gainCountdownExperience,
  generateCandidate,
  hireCandidate,
  unstaffedRoles,
  updateCandidates
} from './staff';
import type { Candidate, CrewMember } from './staff.model';

const lowestRandom = (): number => 0;

describe('experience', () => {
  it('turns experience points into levels 1 to 5', () => {
    expect(experienceLevel(0)).toBe(1);
    expect(experienceLevel(3)).toBe(2);
    expect(experienceLevel(17)).toBe(4);
    expect(experienceLevel(100)).toBe(MAX_EXPERIENCE_LEVEL);
  });

  it('pays experienced staff more', () => {
    const newcomer = STARTING_CREW[0]!;
    expect(dailySalary({ ...newcomer, experiencePoints: 18 })).toBeGreaterThan(dailySalary(newcomer));
  });
});

describe('assembleStationCrew', () => {
  it('puts the most experienced member of each role at the position', () => {
    const veteran: CrewMember = { id: 99, name: 'Veteran', role: 'weather', experiencePoints: 12, trait: null };
    const crew = assembleStationCrew([...STARTING_CREW, veteran])!;

    expect(crew.weather).toEqual({ memberId: 99, name: 'Veteran', level: 4, trait: null });
    expect(crew.flightDirector.level).toBe(1);
  });

  it('adds training bonuses up to the top level', () => {
    const crew = assembleStationCrew(STARTING_CREW, 10)!;
    expect(crew.range.level).toBe(MAX_EXPERIENCE_LEVEL);
  });

  it('needs every position staffed', () => {
    const withoutWeather = STARTING_CREW.filter((member) => member.role !== 'weather');

    expect(assembleStationCrew(withoutWeather)).toBeNull();
    expect(unstaffedRoles(withoutWeather)).toEqual(['weather']);
  });
});

describe('crew effects', () => {
  const newcomers = assembleStationCrew(STARTING_CREW.map((member) => ({ ...member, trait: null })))!;
  const veterans = assembleStationCrew(
    STARTING_CREW.map((member) => ({ ...member, experiencePoints: 18, trait: null }))
  )!;

  it('has no effect with newcomers', () => {
    expect(crewHoldFactor(newcomers, 'sensorAnomaly')).toBe(1);
    expect(crewRiskFactor(newcomers, 'sensorAnomaly')).toBe(1);
    expect(flightDirectorReliabilityBonus(newcomers)).toBe(0);
  });

  it('shortens holds, lowers risks and raises reliability with experience', () => {
    expect(crewHoldFactor(veterans, 'sensorAnomaly')).toBeLessThan(1);
    expect(crewRiskFactor(veterans, 'sensorAnomaly')).toBeLessThan(1);
    expect(flightDirectorReliabilityBonus(veterans)).toBeGreaterThan(0);
  });

  it('lets the weather officer handle weather holds, with a calm one being faster', () => {
    const calmWeather = { ...newcomers, weather: { ...newcomers.weather, trait: 'calm' as const } };

    expect(crewHoldFactor(calmWeather, 'weatherNoGo')).toBe(CALM_HOLD_FACTOR);
    expect(crewHoldFactor(calmWeather, 'sensorAnomaly')).toBe(1);
  });
});

describe('gainCountdownExperience', () => {
  it('gives experience to everyone at a position, twice as much to quick learners', () => {
    const learner: CrewMember = { id: 50, name: 'Learner', role: 'range', experiencePoints: 5, trait: 'quickLearner' };
    const staff = { ...NEW_GAME_STAFF, members: [...STARTING_CREW.filter((m) => m.role !== 'range'), learner] };

    const after = gainCountdownExperience(staff, assembleStationCrew(staff.members)!);

    expect(after.members.find((member) => member.id === 50)?.experiencePoints).toBe(7);
    expect(after.members.find((member) => member.id === 1)?.experiencePoints).toBe(1);
  });
});

describe('hiring', () => {
  const candidate: Candidate = { ...generateCandidate(20, 3, lowestRandom), availableUntilDay: 9 };
  const withCandidate = { ...NEW_GAME_STAFF, candidates: [candidate] };

  it('hires a candidate if there is room', () => {
    const hired = hireCandidate(withCandidate, 20, 10)!;

    expect(hired.members).toContainEqual(expect.objectContaining({ id: 20, name: candidate.name }));
    expect(hired.candidates).toEqual([]);
  });

  it('cannot hire beyond the capacity', () => {
    expect(hireCandidate(withCandidate, 20, STARTING_CREW.length)).toBeNull();
  });

  it('dismisses a member', () => {
    expect(dismissMember(NEW_GAME_STAFF, 1).members).toHaveLength(STARTING_CREW.length - 1);
  });

  it('lets applications expire and brings new ones', () => {
    const later = updateCandidates(withCandidate, 10, lowestRandom);

    expect(later.candidates.map(({ id }) => id)).not.toContain(20);
    expect(later.candidates).toHaveLength(1);
  });
});
