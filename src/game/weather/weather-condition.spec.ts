import { weatherConditionFromWmoCode } from './weather-condition';

describe('weatherConditionFromWmoCode', () => {
  it.each([
    [0, 'clear'],
    [1, 'clear'],
    [2, 'partlyCloudy'],
    [3, 'overcast'],
    [45, 'fog'],
    [53, 'drizzle'],
    [63, 'rain'],
    [81, 'rain'],
    [73, 'snow'],
    [95, 'thunderstorm'],
    [99, 'thunderstorm'],
    [42, 'overcast']
  ])('maps code %i to %s', (code, condition) => {
    expect(weatherConditionFromWmoCode(code)).toBe(condition);
  });
});
