import type { Euros } from '../../game/economy/economy.constants';
import type { Countdown, LaunchCampaign, LaunchOutcome } from '../../game/launch/launch.model';

/** Summary of a finished countdown for the result screen. */
export interface LaunchResult {
  outcome: LaunchOutcome;
  customer: string;
  payloadName: string;
  rocketName: string;
  /** Money received because of the launch. */
  income: Euros;
  /** Money spent because of the launch (repairs, scrub costs). */
  costs: Euros;
  reputationChange: number;
}

export interface LaunchStateModel {
  campaign: LaunchCampaign | null;
  /** The countdown on screen, from its start until the player closes the result. */
  countdown: Countdown | null;
  lastResult: LaunchResult | null;
}
