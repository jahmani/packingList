import { TestBed, inject } from '@angular/core/testing';

import { OrderRowsService } from './order-rows.service';

describe('OrderPackingLinesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderRowsService]
    });
  });

  it('should be created', inject([OrderRowsService], (service: OrderRowsService) => {
    expect(service).toBeTruthy();
  }));
});
