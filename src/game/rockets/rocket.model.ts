import type { OrbitType } from '../contracts/contract.model';
import type { Euros } from '../economy/economy.constants';

export type RocketModelId = 'ibis' | 'albatros';

/** A ready-made rocket type that can be bought from a manufacturer. */
export interface RocketModel {
  id: RocketModelId;
  /** Proper name, not translated. */
  name: string;
  /** Fictional manufacturer, not translated. */
  manufacturer: string;
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
  modelId: RocketModelId;
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
