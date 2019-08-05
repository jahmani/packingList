import { TestBed } from '@angular/core/testing';

import { FirestoreNetworkManagementService } from './firestore-network-management.service';

describe('FirestoreNetworkManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirestoreNetworkManagementService = TestBed.get(FirestoreNetworkManagementService);
    expect(service).toBeTruthy();
  });
});
