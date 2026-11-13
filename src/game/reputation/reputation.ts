import type { LaunchOutcome } from '../launch/launch.model';

/** Reputation is measured in points from 0 to 100. A new spaceport starts in the middle. */
export const STARTING_REPUTATION = 50;
export const MIN_REPUTATION = 0;
export const MAX_REPUTATION = 100;

// Balancing values. Reputation will later decide which contracts customers offer.

/** Reputation gained or lost through a launch. A scrub is part of the business and costs no reputation. */
export const REPUTATION_CHANGE_BY_OUTCOME: Record<LaunchOutcome, number> = {
  success: 5,
  failure: -10,
  scrubbed: 0
};

/** Reputation lost for each contract whose deadline passes before its launch. */
export const REPUTATION_CHANGE_FOR_MISSED_DEADLINE = -5;

export function changeReputation(reputation: number, change: number): number {
  return Math.min(MAX_REPUTATION, Math.max(MIN_REPUTATION, reputation + change));
}
