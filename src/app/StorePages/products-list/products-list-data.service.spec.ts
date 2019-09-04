import { TestBed } from '@angular/core/testing';

import { ProductsListDataService } from './products-list-data.service';

describe('ProductsListDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductsListDataService = TestBed.get(ProductsListDataService);
    expect(service).toBeTruthy();
  });
});
