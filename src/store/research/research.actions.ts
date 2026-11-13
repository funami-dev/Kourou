import type { TechnologyId } from '../../game/research/technology.model';

/** Starts researching a technology. Needs a laboratory, enough research points and enough of the player's money. */
export class StartResearch {
  static readonly type = '[Research] Start research';

  constructor(public readonly technologyId: TechnologyId) {}
}

/** Adds research points, e.g. from a completed research contract. */
export class AddResearchPoints {
  static readonly type = '[Research] Add research points';

  constructor(public readonly points: number) {}
}
