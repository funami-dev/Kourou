import { NO_TECHNOLOGY_BONUSES } from '../research/research';
import { ROCKET_MODELS } from '../rockets/rockets.constants';
import { assembleStationCrew } from '../staff/staff';
import { STARTING_CREW } from '../staff/staff.constants';
import type { LaunchMission } from './launch.model';

/** A launch of the small Ibis rocket to low Earth orbit with the starting crew and no bonuses. */
export function testMission(overrides: Partial<LaunchMission> = {}): LaunchMission {
  return {
    campaign: { contractId: 1, rocketId: 1 },
    vehicle: {
      blueprintId: 'ibis',
      name: ROCKET_MODELS.ibis.name,
      reliability: ROCKET_MODELS.ibis.reliability,
      maxWindGustsMetersPerSecond: ROCKET_MODELS.ibis.maxWindGustsMetersPerSecond
    },
    targetOrbit: 'leo',
    bonuses: NO_TECHNOLOGY_BONUSES,
    rideshareContractIds: [],
    // Without traits, so tests see the plain effect of experience.
    crew: assembleStationCrew(STARTING_CREW.map((member) => ({ ...member, trait: null })))!,
    ...overrides
  };
}
