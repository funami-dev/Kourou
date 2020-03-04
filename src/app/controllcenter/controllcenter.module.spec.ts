import { ControllcenterModule } from './controllcenter.module';

describe('ControllcenterModule', () => {
  let controllcenterModule: ControllcenterModule;

  beforeEach(() => {
    controllcenterModule = new ControllcenterModule();
  });

  it('should create an instance', () => {
    expect(controllcenterModule).toBeTruthy();
  });
});
