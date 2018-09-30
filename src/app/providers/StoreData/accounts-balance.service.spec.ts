import { TestBed, inject } from '@angular/core/testing';

import { AccountsBalanceService } from './accounts-balance.service';

describe('AccountsBalanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountsBalanceService]
    });
  });

  it('should be created', inject([AccountsBalanceService], (service: AccountsBalanceService) => {
    expect(service).toBeTruthy();
  }));
});
