import type { Euros } from '../economy/economy.constants';

export type CoreStageId = 'coreLight' | 'coreMedium' | 'coreHeavy';
export type UpperStageId = 'upperBasic' | 'upperCryogenic';
export type FairingId = 'fairingSmall' | 'fairingLarge';

/** Solid rocket boosters are always mounted in pairs, so the rocket stays balanced. */
export type BoosterCount = 0 | 2 | 4;

/** What every part brings to a rocket. */
interface PartBase {
  cost: Euros;
  /** Chance that the part works through the whole flight. */
  reliability: number;
  /** Game days the part adds to the assembly. */
  assemblyDays: number;
}

/** The main stage that lifts the rocket off the pad. */
export interface CoreStage extends PartBase {
  id: CoreStageId;
  /** Payload it can bring to low Earth orbit together with an upper stage. */
  lowEarthOrbitKg: number;
  maxWindGustsMetersPerSecond: number;
}

export interface Booster extends PartBase {
  /** Extra payload to low Earth orbit per booster. */
  lowEarthOrbitKg: number;
  /** A wider stance makes the rocket more stable in gusts: extra wind limit per pair. */
  windGustToleranceMetersPerSecond: number;
}

/** The stage that takes the payload from the edge of space into its orbit. */
export interface UpperStage extends PartBase {
  id: UpperStageId;
  lowEarthOrbitKg: number;
  /**
   * Share of the low Earth orbit capacity that reaches geostationary transfer orbit.
   * 0 means the stage is not powerful enough for GTO.
   */
  geostationaryTransferShare: number;
}

/** The nose cone that protects the payload; its size limits the payload. */
export interface Fairing extends PartBase {
  id: FairingId;
  maxPayloadKg: number;
}

/** The parts a design is made of. */
export interface RocketDesignParts {
  coreStage: CoreStageId;
  boosterCount: BoosterCount;
  upperStage: UpperStageId;
  fairing: FairingId;
}

/** A rocket the player has designed from parts. */
export interface RocketDesign extends RocketDesignParts {
  id: number;
  /** Chosen by the player. */
  name: string;
}
