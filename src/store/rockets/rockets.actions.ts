import type { RocketDesignParts } from '../../game/rockets/rocket-design.model';
import type { RocketBlueprintId } from '../../game/rockets/rocket.model';

/** Buys a rocket of the given model or design. Only possible if the balance covers the price. */
export class OrderRocket {
  static readonly type = '[Rockets] Order rocket';

  constructor(public readonly blueprintId: RocketBlueprintId) {}
}

/** Saves a rocket designed from parts, so it can be ordered like a catalogue model. */
export class SaveRocketDesign {
  static readonly type = '[Rockets] Save design';

  constructor(
    public readonly name: string,
    public readonly parts: RocketDesignParts
  ) {}
}
