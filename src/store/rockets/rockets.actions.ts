import type { RocketModelId } from '../../game/rockets/rocket.model';

/** Buys a rocket of the given model. Only possible if the balance covers the price. */
export class OrderRocket {
  static readonly type = '[Rockets] Order rocket';

  constructor(public readonly modelId: RocketModelId) {}
}
