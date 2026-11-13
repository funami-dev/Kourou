import type { Euros } from '../economy/economy.constants';

/** Kinds of buildings on the spaceport grounds. More will follow (see docs/game-design.md, "Basis & Gebäude"). */
export type BuildingType = 'laboratory';

/** One construction project that brings a building to the next level. */
export interface Construction {
  level: number;
  startedOnDay: number;
  /** From the start of this game day on, the new level is available. */
  completesOnDay: number;
}

/**
 * A building and its construction history.
 * Its current level is derived from the game day, so nothing has to happen when construction finishes.
 */
export interface Building {
  type: BuildingType;
  constructions: Construction[];
}

/** Cost and duration of building one level. */
export interface BuildingLevelPlan {
  level: number;
  cost: Euros;
  constructionDays: number;
}
