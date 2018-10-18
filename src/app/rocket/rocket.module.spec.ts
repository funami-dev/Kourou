import { RocketModule } from './rocket.module';

describe('RocketModule', () => {
  let rocketModule: RocketModule;

  beforeEach(() => {
    rocketModule = new RocketModule();
  });

  it('should create an instance', () => {
    expect(rocketModule).toBeTruthy();
  });
});
