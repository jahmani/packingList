import { TestBed, inject } from '@angular/core/testing';

import { UserStoresService } from './user-stores.service';

describe('UserStoresService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserStoresService]
    });
  });

  it('should be created', inject([UserStoresService], (service: UserStoresService) => {
    expect(service).toBeTruthy();
  }));
});
