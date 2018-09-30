import { TestBed, inject } from '@angular/core/testing';

import { OrderPackingLinesService } from './order-packing-lines.service';

describe('OrderPackingLinesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderPackingLinesService]
    });
  });

  it('should be created', inject([OrderPackingLinesService], (service: OrderPackingLinesService) => {
    expect(service).toBeTruthy();
  }));
});
