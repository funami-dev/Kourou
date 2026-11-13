import type {
  Booster,
  CoreStage,
  CoreStageId,
  Fairing,
  FairingId,
  UpperStage,
  UpperStageId
} from './rocket-design.model';

// Balancing values. First estimates, to be tuned with play experience.
// Own designs are meant to be cheaper than catalogue models of similar size, but riskier at first.

export const CORE_STAGES: Record<CoreStageId, CoreStage> = {
  coreLight: {
    id: 'coreLight',
    lowEarthOrbitKg: 1_200,
    cost: 3_000_000,
    reliability: 0.985,
    assemblyDays: 2,
    maxWindGustsMetersPerSecond: 13
  },
  coreMedium: {
    id: 'coreMedium',
    lowEarthOrbitKg: 4_000,
    cost: 10_000_000,
    reliability: 0.985,
    assemblyDays: 3,
    maxWindGustsMetersPerSecond: 15
  },
  coreHeavy: {
    id: 'coreHeavy',
    lowEarthOrbitKg: 9_000,
    cost: 30_000_000,
    reliability: 0.98,
    assemblyDays: 4,
    maxWindGustsMetersPerSecond: 17
  }
};

export const BOOSTER: Booster = {
  lowEarthOrbitKg: 1_500,
  cost: 3_000_000,
  reliability: 0.995,
  assemblyDays: 0.5,
  windGustToleranceMetersPerSecond: 0.5
};

export const BOOSTER_COUNTS = [0, 2, 4] as const;

export const UPPER_STAGES: Record<UpperStageId, UpperStage> = {
  upperBasic: {
    id: 'upperBasic',
    lowEarthOrbitKg: 400,
    geostationaryTransferShare: 0,
    cost: 2_000_000,
    reliability: 0.99,
    assemblyDays: 1
  },
  // Liquid hydrogen and oxygen: more efficient, so it can push heavy payloads all the way to GTO.
  upperCryogenic: {
    id: 'upperCryogenic',
    lowEarthOrbitKg: 800,
    geostationaryTransferShare: 0.35,
    cost: 9_000_000,
    reliability: 0.98,
    assemblyDays: 2
  }
};

export const FAIRINGS: Record<FairingId, Fairing> = {
  fairingSmall: { id: 'fairingSmall', maxPayloadKg: 2_500, cost: 400_000, reliability: 0.998, assemblyDays: 0 },
  fairingLarge: { id: 'fairingLarge', maxPayloadKg: 15_000, cost: 1_500_000, reliability: 0.998, assemblyDays: 0 }
};

/** Sun-synchronous orbits are polar: the rocket gets no help from Earth's rotation and carries less. */
export const SUN_SYNCHRONOUS_SHARE = 0.75;

/** Capacities are rounded down to this step, like the figures in real launcher catalogues. */
export const CAPACITY_ROUNDING_STEP_KG = 100;

/** One more day to put all parts together and test the complete rocket. */
export const INTEGRATION_DAYS = 1;

/**
 * A rocket nobody has flown before hides unknown weaknesses: new designs start with this much lower reliability.
 * Every successful launch reveals and fixes some of them (see RELIABILITY_GAIN_PER_SUCCESS).
 */
export const NEW_DESIGN_RELIABILITY_PENALTY = 0.08;

/** Reliability gained with each successful launch of a model or design. */
export const RELIABILITY_GAIN_PER_SUCCESS = 0.01;

/** Catalogue models are already proven and can only improve a little through the spaceport's own experience. */
export const MAX_RELIABILITY_GAIN_CATALOGUE = 0.02;
export const MAX_RELIABILITY_GAIN_DESIGN = NEW_DESIGN_RELIABILITY_PENALTY;

/** Longest name a player can give a design. */
export const MAX_DESIGN_NAME_LENGTH = 30;
