import { TestBed } from '@angular/core/testing';

import { ProductPickerService } from './product-picker.service';

describe('ProductPickerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductPickerService = TestBed.get(ProductPickerService);
    expect(service).toBeTruthy();
  });
});
