import { TestBed, inject } from '@angular/core/testing';

import { ReactivePathFirestoreData } from './reactive-path-firestore-data.service';

describe('ReactivePathFirestoreDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReactivePathFirestoreData]
    });
  });

  it('should be created', inject([ReactivePathFirestoreData], (service: ReactivePathFirestoreData) => {
    expect(service).toBeTruthy();
  }));
});
