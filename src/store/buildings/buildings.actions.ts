import type { BuildingType } from '../../game/buildings/building.model';

/** Builds a new building or upgrades it to the next level. Only possible with enough of the player's own money. */
export class StartBuildingConstruction {
  static readonly type = '[Buildings] Start construction';

  constructor(public readonly buildingType: BuildingType) {}
}
