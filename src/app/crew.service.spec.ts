import { TestBed } from '@angular/core/testing';

import { CrewService } from './crew.service';

describe('CrewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CrewService = TestBed.get(CrewService);
    expect(service).toBeTruthy();
  });
});
