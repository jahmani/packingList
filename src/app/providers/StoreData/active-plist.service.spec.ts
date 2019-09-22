import { TestBed } from '@angular/core/testing';

import { ActivePListService } from './active-plist.service';

describe('ActivePListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActivePListService = TestBed.get(ActivePListService);
    expect(service).toBeTruthy();
  });
});
