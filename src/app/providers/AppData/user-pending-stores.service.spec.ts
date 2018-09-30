import { TestBed, inject } from '@angular/core/testing';

import { UserPendingStoresService } from './user-pending-stores.service';

describe('UserPendingStoresService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserPendingStoresService]
    });
  });

  it('should be created', inject([UserPendingStoresService], (service: UserPendingStoresService) => {
    expect(service).toBeTruthy();
  }));
});
