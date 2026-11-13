import type { Contract, Payload } from '../contracts/contract.model';
import type { Rocket, RocketModel } from '../rockets/rocket.model';
import { rocketStatus } from '../rockets/rocket-fleet';
import { ROCKET_MODELS } from '../rockets/rockets.constants';
import type { LaunchCampaign } from './launch.model';

/** Whether the rocket can bring the payload to its target orbit. */
export function canCarry(model: RocketModel, payload: Payload): boolean {
  return model.payloadCapacityKg[payload.targetOrbit] >= payload.massKg;
}

/** Assembled rockets that are not on the launch pad yet and can carry the contract's payload. */
export function rocketsAvailableFor(
  contract: Contract,
  rockets: readonly Rocket[],
  campaign: LaunchCampaign | null,
  nowMs: number
): Rocket[] {
  return rockets.filter(
    (rocket) =>
      rocket.id !== campaign?.rocketId &&
      rocketStatus(rocket, nowMs) === 'ready' &&
      canCarry(ROCKET_MODELS[rocket.modelId], contract.payload)
  );
}
