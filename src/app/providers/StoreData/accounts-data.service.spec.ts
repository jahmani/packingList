import { TestBed, inject } from '@angular/core/testing';

import { AccountsDataService } from './accounts-data.service';

describe('AccountsDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountsDataService]
    });
  });

  it('should be created', inject([AccountsDataService], (service: AccountsDataService) => {
    expect(service).toBeTruthy();
  }));
});
