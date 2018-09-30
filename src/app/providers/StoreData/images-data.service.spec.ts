import { TestBed, inject } from '@angular/core/testing';

import { ImagesDataService } from './images-data.service';

describe('ImagesDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImagesDataService]
    });
  });

  it('should be created', inject([ImagesDataService], (service: ImagesDataService) => {
    expect(service).toBeTruthy();
  }));
});
