import type { OrbitType } from '../contracts/contract.model';
import type { RocketDesign, RocketDesignParts } from './rocket-design.model';
import type { RocketBlueprintId, RocketBlueprints, RocketDesignBlueprintId, RocketModel } from './rocket.model';
import {
  BOOSTER,
  CAPACITY_ROUNDING_STEP_KG,
  CORE_STAGES,
  FAIRINGS,
  INTEGRATION_DAYS,
  MAX_DESIGN_NAME_LENGTH,
  MAX_RELIABILITY_GAIN_CATALOGUE,
  MAX_RELIABILITY_GAIN_DESIGN,
  NEW_DESIGN_RELIABILITY_PENALTY,
  RELIABILITY_GAIN_PER_SUCCESS,
  SUN_SYNCHRONOUS_SHARE,
  UPPER_STAGES
} from './rocket-parts.constants';
import { ROCKET_MODELS } from './rockets.constants';

/** Successful launches so far, by catalogue model or design. */
export type LaunchExperience = Partial<Record<RocketBlueprintId, number>>;

export function designBlueprintId(designId: number): RocketDesignBlueprintId {
  return `design-${designId}`;
}

/** The performance of a set of parts, as if it were a catalogue model (before any launch experience). */
export function designPerformance(parts: RocketDesignParts): Omit<RocketModel, 'id' | 'name' | 'serialPrefix'> {
  const core = CORE_STAGES[parts.coreStage];
  const upper = UPPER_STAGES[parts.upperStage];
  const fairing = FAIRINGS[parts.fairing];
  const boosterPairs = parts.boosterCount / 2;

  const lowEarthOrbitKg = core.lowEarthOrbitKg + parts.boosterCount * BOOSTER.lowEarthOrbitKg + upper.lowEarthOrbitKg;
  const capacity = (massKg: number): number => Math.min(fairing.maxPayloadKg, roundDownToCapacityStep(massKg));
  const payloadCapacityKg: Record<OrbitType, number> = {
    leo: capacity(lowEarthOrbitKg),
    sso: capacity(lowEarthOrbitKg * SUN_SYNCHRONOUS_SHARE),
    gto: capacity(lowEarthOrbitKg * upper.geostationaryTransferShare)
  };

  // Every part has to work for the flight to succeed, so the chances multiply.
  const partsReliability =
    core.reliability * BOOSTER.reliability ** parts.boosterCount * upper.reliability * fairing.reliability;

  return {
    manufacturer: null,
    payloadCapacityKg,
    price: core.cost + parts.boosterCount * BOOSTER.cost + upper.cost + fairing.cost,
    assemblyDays:
      core.assemblyDays +
      parts.boosterCount * BOOSTER.assemblyDays +
      upper.assemblyDays +
      fairing.assemblyDays +
      INTEGRATION_DAYS,
    reliability: partsReliability - NEW_DESIGN_RELIABILITY_PENALTY,
    maxWindGustsMetersPerSecond:
      core.maxWindGustsMetersPerSecond + boosterPairs * BOOSTER.windGustToleranceMetersPerSecond
  };
}

function roundDownToCapacityStep(massKg: number): number {
  return Math.floor(massKg / CAPACITY_ROUNDING_STEP_KG) * CAPACITY_ROUNDING_STEP_KG;
}

/** A design as a blueprint that can be ordered like a catalogue model. */
export function designBlueprint(design: RocketDesign): RocketModel {
  return {
    id: designBlueprintId(design.id),
    name: design.name,
    // Own designs get serial names like "E3-01": E for "Eigenbau", followed by the design number.
    serialPrefix: `E${design.id}`,
    ...designPerformance(design)
  };
}

/** Reliability gained through successful launches; catalogue models are already proven and gain less. */
export function reliabilityGain(blueprint: RocketModel, successfulLaunches: number): number {
  const maxGain = blueprint.manufacturer === null ? MAX_RELIABILITY_GAIN_DESIGN : MAX_RELIABILITY_GAIN_CATALOGUE;
  return Math.min(maxGain, successfulLaunches * RELIABILITY_GAIN_PER_SUCCESS);
}

/** All rockets that can be ordered: catalogue models and own designs, with reliability from experience. */
export function rocketBlueprints(designs: readonly RocketDesign[], experience: LaunchExperience): RocketBlueprints {
  const blueprints: RocketModel[] = [...Object.values(ROCKET_MODELS), ...designs.map(designBlueprint)];
  return Object.fromEntries(
    blueprints.map((blueprint) => [
      blueprint.id,
      { ...blueprint, reliability: blueprint.reliability + reliabilityGain(blueprint, experience[blueprint.id] ?? 0) }
    ])
  );
}

/** Cleans up a name typed by the player. Returns `null` if nothing usable is left. */
export function normalizeDesignName(name: string): string | null {
  const trimmed = name.trim().slice(0, MAX_DESIGN_NAME_LENGTH);
  return trimmed.length > 0 ? trimmed : null;
}
