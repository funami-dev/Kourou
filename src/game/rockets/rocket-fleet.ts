import { MS_PER_DAY } from '../clock/clock.constants';
import type { TechnologyBonuses } from '../research/technology.model';
import { normalizeDesignName } from './rocket-design';
import type { LaunchExperience } from './rocket-design';
import type { RocketDesign, RocketDesignParts } from './rocket-design.model';
import type { Rocket, RocketBlueprintId, RocketBlueprints, RocketModel, RocketStatus } from './rocket.model';
import { SHIP_DELIVERY_DAYS } from './rockets.constants';

/** All rockets the player owns, the player's own designs and the experience with each type of rocket. */
export interface RocketFleet {
  rockets: Rocket[];
  nextId: number;
  designs: RocketDesign[];
  nextDesignId: number;
  launchExperience: LaunchExperience;
}

/** What affects delivery and assembly: technologies, the port and the size of the assembly hall. */
export type OrderBonuses = Pick<TechnologyBonuses, 'assemblyDurationFactor' | 'shippingDaysSaved'> & {
  /** Rockets the assembly hall can assemble at the same time. */
  assemblySlots: number;
};

const NO_ORDER_BONUSES: OrderBonuses = { assemblyDurationFactor: 1, shippingDaysSaved: 0, assemblySlots: 1 };

export const NEW_GAME_ROCKET_FLEET: RocketFleet = {
  rockets: [],
  nextId: 1,
  designs: [],
  nextDesignId: 1,
  launchExperience: {}
};

/**
 * Orders a rocket and plans its schedule: shipping first, then assembly.
 * The assembly hall has a limited number of bays, so assembly may have to wait until one is free.
 */
export function orderRocket(
  fleet: RocketFleet,
  model: RocketModel,
  orderedAtMs: number,
  bonuses: OrderBonuses = NO_ORDER_BONUSES
): { fleet: RocketFleet; rocket: Rocket } {
  const arrivesAtMs = orderedAtMs + (SHIP_DELIVERY_DAYS - bonuses.shippingDaysSaved) * MS_PER_DAY;
  const assemblyStartsAtMs = Math.max(arrivesAtMs, nextFreeAssemblyBayAtMs(fleet, bonuses.assemblySlots));

  const rocket: Rocket = {
    id: fleet.nextId,
    modelId: model.id,
    serialName: nextSerialName(fleet, model),
    orderedAtMs,
    arrivesAtMs,
    assemblyStartsAtMs,
    readyAtMs: assemblyStartsAtMs + model.assemblyDays * bonuses.assemblyDurationFactor * MS_PER_DAY
  };

  return {
    fleet: { ...fleet, rockets: [...fleet.rockets, rocket], nextId: fleet.nextId + 1 },
    rocket
  };
}

/** Full name of a rocket for display, e.g. "Ibis IB-01". */
export function rocketDisplayName(rocket: Rocket, blueprints: RocketBlueprints): string {
  return `${blueprints[rocket.modelId]?.name ?? ''} ${rocket.serialName}`.trim();
}

/** Saves a new design. Returns `null` if the name is empty. */
export function saveDesign(fleet: RocketFleet, name: string, parts: RocketDesignParts): RocketFleet | null {
  const designName = normalizeDesignName(name);
  if (!designName) {
    return null;
  }
  const design: RocketDesign = { id: fleet.nextDesignId, name: designName, ...parts };
  return { ...fleet, designs: [...fleet.designs, design], nextDesignId: fleet.nextDesignId + 1 };
}

/** Counts a successful launch of the model or design, which makes the next ones more reliable. */
export function recordSuccessfulLaunch(fleet: RocketFleet, blueprintId: RocketBlueprintId): RocketFleet {
  const successfulLaunches = (fleet.launchExperience[blueprintId] ?? 0) + 1;
  return { ...fleet, launchExperience: { ...fleet.launchExperience, [blueprintId]: successfulLaunches } };
}

/** Removes a rocket from the fleet, e.g. after it has been launched. */
export function removeRocket(fleet: RocketFleet, rocketId: number): RocketFleet {
  return { ...fleet, rockets: fleet.rockets.filter((rocket) => rocket.id !== rocketId) };
}

/**
 * The moment the next assembly bay becomes free.
 * With n bays, a new rocket has to wait for the n-th latest planned assembly to finish.
 */
function nextFreeAssemblyBayAtMs(fleet: RocketFleet, assemblySlots: number): number {
  const latestFirst = fleet.rockets.map((rocket) => rocket.readyAtMs).sort((first, second) => second - first);
  return latestFirst[Math.max(1, assemblySlots) - 1] ?? 0;
}

/** Serial names count per model, e.g. the third Ibis is "IB-03". */
function nextSerialName(fleet: RocketFleet, model: RocketModel): string {
  const numberOfThisModel = fleet.rockets.filter((rocket) => rocket.modelId === model.id).length + 1;
  return `${model.serialPrefix}-${numberOfThisModel.toString().padStart(2, '0')}`;
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
