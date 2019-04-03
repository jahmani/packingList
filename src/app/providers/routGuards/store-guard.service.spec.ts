import { TestBed, inject } from '@angular/core/testing';
import { StoreGuardService } from './store-guard.service';


describe('StoreGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoreGuardService]
    });
  });

  it('should be created', inject([StoreGuardService], (service: StoreGuardService) => {
    expect(service).toBeTruthy();
  }));
});
