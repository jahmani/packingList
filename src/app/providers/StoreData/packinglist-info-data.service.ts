import { Injectable } from '@angular/core';
import { PackinglistInfo } from '../../interfaces/data-models';
import { StoreDataService } from './store-data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActiveStoreService } from '../AppData/active-store.service';
import { StorePathConfig } from '../../interfaces/StorePathConfig';

@Injectable({
  providedIn: 'root'
})
export class PackinglistInfoDataService extends StoreDataService<PackinglistInfo> {

  constructor(afs: AngularFirestore, activeStoreService: ActiveStoreService) {
    super(afs, activeStoreService, StorePathConfig.PackinglistInfo);
 }
}
