import type { TechnologyId } from '../../game/research/technology.model';

/** Starts researching a technology. Needs a laboratory, enough research points and enough of the player's money. */
export class StartResearch {
  static readonly type = '[Research] Start research';

  constructor(public readonly technologyId: TechnologyId) {}
}
