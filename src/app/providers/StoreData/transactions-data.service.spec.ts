import { TestBed, inject } from '@angular/core/testing';

import { TransactionsDataService } from './transactions-data.service';

describe('TransactionsDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionsDataService]
    });
  });

  it('should be created', inject([TransactionsDataService], (service: TransactionsDataService) => {
    expect(service).toBeTruthy();
  }));
});
