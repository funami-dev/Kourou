import { MS_PER_DAY, MS_PER_HOUR, MS_PER_MINUTE } from './clock.constants';
import { realToGameDuration, toGameDateTime } from './game-time';

describe('realToGameDuration', () => {
  it('turns one real hour into one game day at normal speed', () => {
    expect(realToGameDuration(60 * MS_PER_MINUTE, 1)).toBe(MS_PER_DAY);
  });

  it('turns 2.5 real seconds into one game minute at normal speed', () => {
    expect(realToGameDuration(2_500, 1)).toBe(MS_PER_MINUTE);
  });

  it('scales with the game speed', () => {
    expect(realToGameDuration(15 * MS_PER_MINUTE, 4)).toBe(MS_PER_DAY);
  });
});

describe('toGameDateTime', () => {
  it('starts counting days at 1', () => {
    expect(toGameDateTime(0)).toEqual({ day: 1, hour: 0, minute: 0 });
  });

  it('breaks game time down into day, hour and minute', () => {
    const gameTimeMs = 2 * MS_PER_DAY + 14 * MS_PER_HOUR + 35 * MS_PER_MINUTE + 59_999;

    expect(toGameDateTime(gameTimeMs)).toEqual({ day: 3, hour: 14, minute: 35 });
  });
});
