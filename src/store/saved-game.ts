import { NEW_GAME_CONTRACT_MARKET } from '../game/contracts/contract-market';
import { NEW_GAME_LEDGER } from '../game/economy/ledger';
import { NEW_GAME_RESEARCH_PROGRESS } from '../game/research/research';
import { NEW_GAME_RESEARCH_CONTRACT_MARKET } from '../game/research/research-contracts';
import { STARTING_REPUTATION } from '../game/reputation/reputation';
import { NEW_GAME_ROCKET_FLEET } from '../game/rockets/rocket-fleet';
import { NEW_GAME_STAFF } from '../game/staff/staff';
import { NEW_GAME_BUILDINGS } from './buildings/buildings.state';
import { NEW_GAME_CLOCK } from './clock/clock.state';
import { NEW_GAME_LAUNCH } from './launch/launch.state';

/** New-game values of the persisted game states, by state name. */
const NEW_GAME_STATES: Record<string, object> = {
  buildings: NEW_GAME_BUILDINGS,
  clock: NEW_GAME_CLOCK,
  contracts: NEW_GAME_CONTRACT_MARKET,
  finance: NEW_GAME_LEDGER,
  launch: NEW_GAME_LAUNCH,
  reputation: { points: STARTING_REPUTATION },
  research: NEW_GAME_RESEARCH_PROGRESS,
  researchContracts: NEW_GAME_RESEARCH_CONTRACT_MARKET,
  rockets: NEW_GAME_ROCKET_FLEET,
  staff: NEW_GAME_STAFF
};

/**
 * Brings a saved game up to date with the current version of the game:
 * states and fields that were added after the game was saved start with their new-game values,
 * everything that was saved is kept.
 */
export function completeSavedGame(savedGame: unknown): Record<string, unknown> {
  const saved = isPlainObject(savedGame) ? savedGame : {};
  const completed: Record<string, unknown> = { ...saved };

  for (const [stateName, newGameValue] of Object.entries(NEW_GAME_STATES)) {
    const savedState = saved[stateName];
    completed[stateName] = isPlainObject(savedState) ? { ...newGameValue, ...savedState } : newGameValue;
  }
  return completed;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
