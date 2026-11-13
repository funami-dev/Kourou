import { MS_PER_DAY, MS_PER_HOUR, MS_PER_MINUTE } from '../../game/clock/clock.constants';
import { GameDateTimePipe } from './game-date-time.pipe';

describe('GameDateTimePipe', () => {
  const pipe = new GameDateTimePipe();

  it('shows the game day and the time of day with two-digit hours and minutes', () => {
    expect(pipe.transform(2 * MS_PER_DAY + 9 * MS_PER_HOUR + 5 * MS_PER_MINUTE)).toBe('Tag 3 · 09:05');
  });
});
