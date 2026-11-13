import { NEW_GAME_RESEARCH_PROGRESS } from '../game/research/research';
import { NEW_GAME_BUILDINGS } from './buildings/buildings.state';
import { completeSavedGame } from './saved-game';

describe('completeSavedGame', () => {
  it('adds states that did not exist when the game was saved', () => {
    const completed = completeSavedGame({ gui: { currentLocation: 'kourou' } });

    expect(completed['buildings']).toEqual(NEW_GAME_BUILDINGS);
    expect(completed['gui']).toEqual({ currentLocation: 'kourou' });
  });

  it('adds new fields to saved states and keeps the saved values', () => {
    const completed = completeSavedGame({ research: { researchPoints: 42 } });

    expect(completed['research']).toEqual({ ...NEW_GAME_RESEARCH_PROGRESS, researchPoints: 42 });
  });

  it('starts a new game from an unreadable save', () => {
    expect(completeSavedGame('nonsense')['research']).toEqual(NEW_GAME_RESEARCH_PROGRESS);
  });
});
