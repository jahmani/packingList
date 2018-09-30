import { TestBed, inject } from '@angular/core/testing';

import { ActiveStoreService } from './active-store.service';

describe('ActiveStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActiveStoreService]
    });
  });

  it('should be created', inject([ActiveStoreService], (service: ActiveStoreService) => {
    expect(service).toBeTruthy();
  }));
});
