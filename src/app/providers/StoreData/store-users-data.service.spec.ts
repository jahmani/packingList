import { TestBed, inject } from '@angular/core/testing';

import { StoreUsersDataService } from './store-users-data.service';

describe('StoreUsersDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoreUsersDataService]
    });
  });

  it('should be created', inject([StoreUsersDataService], (service: StoreUsersDataService) => {
    expect(service).toBeTruthy();
  }));
});
