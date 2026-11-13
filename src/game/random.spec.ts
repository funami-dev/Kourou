import { pickRandom, randomIntegerBetween } from './random';

describe('randomIntegerBetween', () => {
  it('returns the minimum for the lowest random number', () => {
    expect(randomIntegerBetween(() => 0, 3, 7)).toBe(3);
  });

  it('returns the maximum for the highest random number', () => {
    expect(randomIntegerBetween(() => 0.9999, 3, 7)).toBe(7);
  });
});

describe('pickRandom', () => {
  it('picks an item from the list', () => {
    expect(pickRandom(() => 0.5, ['a', 'b', 'c'])).toBe('b');
  });

  it('refuses an empty list', () => {
    expect(() => pickRandom(() => 0.5, [])).toThrow();
  });
});
