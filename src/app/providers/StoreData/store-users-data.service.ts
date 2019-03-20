import { Injectable } from '@angular/core';
import { StoreDataService } from './store-data.service';
import { StoreUser } from '../../interfaces/data-models';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActiveStoreService } from '../AppData/active-store.service';
import { StorePathConfig } from '../../interfaces/StorePathConfig';

@Injectable({
  providedIn: 'root'
})
export class StoreUsersDataService extends StoreDataService<StoreUser> {
  constructor(afs: AngularFirestore, activeStoreService: ActiveStoreService, ) {
    super(afs, activeStoreService, StorePathConfig.storeUsers);
  }
}
