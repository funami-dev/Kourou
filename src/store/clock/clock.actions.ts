import type { GameSpeed } from '../../game/clock/clock.constants';

/** Lets game time pass for the given amount of real time. Has no effect while the clock is paused. */
export class AdvanceClock {
  static readonly type = '[Clock] Advance';

  constructor(public readonly realElapsedMs: number) {}
}

export class PauseClock {
  static readonly type = '[Clock] Pause';
}

export class ResumeClock {
  static readonly type = '[Clock] Resume';
}

export class SetClockSpeed {
  static readonly type = '[Clock] Set speed';

  constructor(public readonly speed: GameSpeed) {}
}
