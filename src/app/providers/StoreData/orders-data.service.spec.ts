import { TestBed, inject } from '@angular/core/testing';

import { OrdersDataService } from './orders-data.service';

describe('OrdersDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrdersDataService]
    });
  });

  it('should be created', inject([OrdersDataService], (service: OrdersDataService) => {
    expect(service).toBeTruthy();
  }));
});
