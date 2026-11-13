/**
 * Amounts of money, in whole euros.
 * The alias makes it clear in signatures and models which numbers are money.
 */
export type Euros = number;

// Balancing values. These are first estimates and will be tuned once contracts and rockets exist.

/** Money available at the start of a new game. */
export const STARTING_BALANCE: Euros = 100_000_000;

/**
 * Fixed daily costs of running the spaceport (staff, maintenance, energy).
 * Placeholder until buildings and crew bring their own running costs.
 */
export const DAILY_OPERATING_COSTS: Euros = 250_000;

/**
 * When the balance drops below zero, the state steps in and tops it up to this amount.
 * There is no bankruptcy and no penalty (see docs/game-design.md): everyone in this world loves space research.
 * The grant only covers enough to carry on, so running the spaceport well is still the faster way to grow.
 */
export const STATE_GRANT_TARGET_BALANCE: Euros = 10_000_000;

/** Number of most recent transactions kept in the ledger, so the saved game stays small. */
export const MAX_LEDGER_ENTRIES = 200;
