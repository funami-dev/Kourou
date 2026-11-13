import { MAX_REPUTATION, MIN_REPUTATION, changeReputation } from './reputation';

describe('changeReputation', () => {
  it('adds the change', () => {
    expect(changeReputation(50, 5)).toBe(55);
    expect(changeReputation(50, -10)).toBe(40);
  });

  it('stays within the reputation scale', () => {
    expect(changeReputation(98, 5)).toBe(MAX_REPUTATION);
    expect(changeReputation(3, -10)).toBe(MIN_REPUTATION);
  });
});
