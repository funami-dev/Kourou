import type { OrbitType } from '../contracts/contract.model';
import type { Euros } from '../economy/economy.constants';

/** Ready-made rocket models from the catalogue. */
export type RocketModelId = 'ibis' | 'albatros';

/** Rockets the player has designed from parts are identified as `design-<number>`. */
export type RocketDesignBlueprintId = `design-${number}`;

/** Anything a rocket can be built from: a catalogue model or an own design. */
export type RocketBlueprintId = RocketModelId | RocketDesignBlueprintId;

/** Catalogue models and own designs by id. Lookups can miss, e.g. for a design that no longer exists. */
export type RocketBlueprints = Partial<Record<RocketBlueprintId, RocketModel>>;

/** Everything needed to order, assemble and launch a type of rocket. */
export interface RocketModel {
  id: RocketBlueprintId;
  /** Proper name, not translated. */
  name: string;
  /** Fictional manufacturer, not translated; `null` for the spaceport's own designs. */
  manufacturer: string | null;
  /** Prefix for the serial names of individual rockets, e.g. "IB" for "IB-01". */
  serialPrefix: string;
  /** Maximum payload mass per orbit when launched from Kourou. 0 means the orbit is out of reach. */
  payloadCapacityKg: Record<OrbitType, number>;
  price: Euros;
  /** Game days needed to assemble the rocket once its parts have arrived. */
  assemblyDays: number;
  /** Chance of a successful launch, between 0 and 1. */
  reliability: number;
  /** Strongest ground wind gusts at which the rocket may still launch. */
  maxWindGustsMetersPerSecond: number;
}

/**
 * A rocket the player has bought.
 * Its whole schedule is fixed when it is ordered, so its status can always be derived from the current game time.
 */
export interface Rocket {
  id: number;
  /** The catalogue model or own design the rocket was built from. */
  modelId: RocketBlueprintId;
  /** Unique name of this rocket, e.g. "IB-01". */
  serialName: string;
  orderedAtMs: number;
  /** When the ship with the rocket's parts arrives at the port. */
  arrivesAtMs: number;
  /** When assembly begins. Later than the arrival if the assembly hall is still busy with another rocket. */
  assemblyStartsAtMs: number;
  /** When the rocket is assembled and ready for launch preparations. */
  readyAtMs: number;
}

export type RocketStatus = 'inTransit' | 'waitingForAssembly' | 'inAssembly' | 'ready';
