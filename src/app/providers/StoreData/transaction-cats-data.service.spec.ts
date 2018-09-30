import { TestBed, inject } from '@angular/core/testing';

import { TransactionCatsDataService } from './transaction-cats-data.service';

describe('TransactionCatsDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionCatsDataService]
    });
  });

  it('should be created', inject([TransactionCatsDataService], (service: TransactionCatsDataService) => {
    expect(service).toBeTruthy();
  }));
});
