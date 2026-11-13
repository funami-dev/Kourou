import { MS_PER_DAY } from '../clock/clock.constants';
import type { TechnologyBonuses } from '../research/technology.model';
import type { RocketModelId, Rocket, RocketStatus } from './rocket.model';
import { ROCKET_MODELS, SHIP_DELIVERY_DAYS } from './rockets.constants';

/** All rockets the player owns. */
export interface RocketFleet {
  rockets: Rocket[];
  nextId: number;
}

/** Technology bonuses that speed up delivery and assembly. */
export type OrderBonuses = Pick<TechnologyBonuses, 'assemblyDurationFactor' | 'shippingDaysSaved'>;

const NO_ORDER_BONUSES: OrderBonuses = { assemblyDurationFactor: 1, shippingDaysSaved: 0 };

export const NEW_GAME_ROCKET_FLEET: RocketFleet = {
  rockets: [],
  nextId: 1
};

/**
 * Orders a rocket and plans its schedule: shipping first, then assembly.
 * The assembly hall works on one rocket at a time, so assembly waits until the hall is free.
 */
export function orderRocket(
  fleet: RocketFleet,
  modelId: RocketModelId,
  orderedAtMs: number,
  bonuses: OrderBonuses = NO_ORDER_BONUSES
): { fleet: RocketFleet; rocket: Rocket } {
  const model = ROCKET_MODELS[modelId];
  const arrivesAtMs = orderedAtMs + (SHIP_DELIVERY_DAYS - bonuses.shippingDaysSaved) * MS_PER_DAY;
  const assemblyStartsAtMs = Math.max(arrivesAtMs, assemblyHallFreeAtMs(fleet));

  const rocket: Rocket = {
    id: fleet.nextId,
    modelId,
    serialName: nextSerialName(fleet, modelId),
    orderedAtMs,
    arrivesAtMs,
    assemblyStartsAtMs,
    readyAtMs: assemblyStartsAtMs + model.assemblyDays * bonuses.assemblyDurationFactor * MS_PER_DAY
  };

  return {
    fleet: { rockets: [...fleet.rockets, rocket], nextId: fleet.nextId + 1 },
    rocket
  };
}

/** Full name of a rocket for display, e.g. "Ibis IB-01". */
export function rocketDisplayName(rocket: Rocket): string {
  return `${ROCKET_MODELS[rocket.modelId].name} ${rocket.serialName}`;
}

/** Removes a rocket from the fleet, e.g. after it has been launched. */
export function removeRocket(fleet: RocketFleet, rocketId: number): RocketFleet {
  return { ...fleet, rockets: fleet.rockets.filter((rocket) => rocket.id !== rocketId) };
}

/** The moment the last planned assembly is finished. */
function assemblyHallFreeAtMs(fleet: RocketFleet): number {
  return Math.max(0, ...fleet.rockets.map((rocket) => rocket.readyAtMs));
}

/** Serial names count per model, e.g. the third Ibis is "IB-03". */
function nextSerialName(fleet: RocketFleet, modelId: RocketModelId): string {
  const numberOfThisModel = fleet.rockets.filter((rocket) => rocket.modelId === modelId).length + 1;
  return `${ROCKET_MODELS[modelId].serialPrefix}-${numberOfThisModel.toString().padStart(2, '0')}`;
}

export function rocketStatus(rocket: Rocket, nowMs: number): RocketStatus {
  if (nowMs < rocket.arrivesAtMs) {
    return 'inTransit';
  }
  if (nowMs < rocket.assemblyStartsAtMs) {
    return 'waitingForAssembly';
  }
  if (nowMs < rocket.readyAtMs) {
    return 'inAssembly';
  }
  return 'ready';
}

/** How far the current step (shipping, waiting or assembly) has progressed, between 0 and 1. */
export function progressOfCurrentStep(rocket: Rocket, nowMs: number): number {
  const [stepStartMs, stepEndMs] = currentStepSpan(rocket, rocketStatus(rocket, nowMs));
  if (stepEndMs <= stepStartMs) {
    return 1;
  }
  return Math.min(1, Math.max(0, (nowMs - stepStartMs) / (stepEndMs - stepStartMs)));
}

/** When the current step ends, or `null` once the rocket is ready. */
export function endOfCurrentStepMs(rocket: Rocket, nowMs: number): number | null {
  const status = rocketStatus(rocket, nowMs);
  return status === 'ready' ? null : currentStepSpan(rocket, status)[1];
}

function currentStepSpan(rocket: Rocket, status: RocketStatus): [startMs: number, endMs: number] {
  switch (status) {
    case 'inTransit':
      return [rocket.orderedAtMs, rocket.arrivesAtMs];
    case 'waitingForAssembly':
      return [rocket.arrivesAtMs, rocket.assemblyStartsAtMs];
    case 'inAssembly':
    case 'ready':
      return [rocket.assemblyStartsAtMs, rocket.readyAtMs];
  }
}
