import { TestBed, inject } from '@angular/core/testing';

import { PackinglistInfoDataService } from './packinglist-info-data.service';

describe('PackinglistInfoDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PackinglistInfoDataService]
    });
  });

  it('should be created', inject([PackinglistInfoDataService], (service: PackinglistInfoDataService) => {
    expect(service).toBeTruthy();
  }));
});
