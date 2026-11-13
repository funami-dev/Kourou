import type { Contract, Payload } from '../contracts/contract.model';
import type { Rocket, RocketBlueprints, RocketModel } from '../rockets/rocket.model';
import { rocketStatus } from '../rockets/rocket-fleet';
import type { LaunchCampaign } from './launch.model';

/** Whether the rocket can bring the payload to its target orbit. */
export function canCarry(model: RocketModel | undefined, payload: Payload): boolean {
  return model !== undefined && model.payloadCapacityKg[payload.targetOrbit] >= payload.massKg;
}

/** Assembled rockets that are not on the launch pad yet and can carry the contract's payload. */
export function rocketsAvailableFor(
  contract: Contract,
  rockets: readonly Rocket[],
  campaign: LaunchCampaign | null,
  nowMs: number,
  blueprints: RocketBlueprints
): Rocket[] {
  return rockets.filter(
    (rocket) =>
      rocket.id !== campaign?.rocketId &&
      rocketStatus(rocket, nowMs) === 'ready' &&
      canCarry(blueprints[rocket.modelId], contract.payload)
  );
}
