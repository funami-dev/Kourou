import { MissionTimePipe } from './mission-time.pipe';

describe('MissionTimePipe', () => {
  const pipe = new MissionTimePipe();

  it('counts down before liftoff', () => {
    expect(pipe.transform(-600_000)).toBe('T−10:00');
    expect(pipe.transform(-582_300)).toBe('T−09:43');
  });

  it('counts up after liftoff', () => {
    expect(pipe.transform(0)).toBe('T+00:00');
    expect(pipe.transform(70_900)).toBe('T+01:10');
  });
});
