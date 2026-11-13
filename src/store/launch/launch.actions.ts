import type { CountdownDecision, LaunchCampaign, LaunchOutcome } from '../../game/launch/launch.model';

/** Brings an assembled rocket to the launch pad to launch the payload of a contract. */
export class MoveRocketToPad {
  static readonly type = '[Launch] Move rocket to pad';

  constructor(
    public readonly contractId: number,
    public readonly rocketId: number
  ) {}
}

/** Takes the rocket back from the launch pad. Not possible while a countdown is running. */
export class RemoveRocketFromPad {
  static readonly type = '[Launch] Remove rocket from pad';
}

export class StartCountdown {
  static readonly type = '[Launch] Start countdown';
}

/** Lets real time pass in the running countdown. Dispatched by the game loop. */
export class AdvanceCountdown {
  static readonly type = '[Launch] Advance countdown';

  constructor(public readonly realElapsedMs: number) {}
}

export class DecideOnCountdownIssue {
  static readonly type = '[Launch] Decide on countdown issue';

  constructor(public readonly decision: CountdownDecision) {}
}

/** Leaves the result screen of a finished countdown; game time runs again. */
export class CloseCountdown {
  static readonly type = '[Launch] Close countdown';
}

/** Announces how a countdown ended, so contracts, rockets and reputation can follow up. */
export class LaunchCompleted {
  static readonly type = '[Launch] Launch completed';

  constructor(
    public readonly outcome: LaunchOutcome,
    public readonly campaign: LaunchCampaign,
    public readonly rideshareContractIds: number[]
  ) {}
}
