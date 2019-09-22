import { Injectable } from '@angular/core';
import { PackinglistInfo, Extended } from '../../interfaces/data-models';
import { StoreDataService } from './store-data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActiveStoreService } from '../AppData/active-store.service';
import { StorePathConfig } from '../../interfaces/StorePathConfig';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PackinglistInfoDataService extends StoreDataService<PackinglistInfo> {
  ListWithNewEmptyPackingInfo: Observable<Extended<PackinglistInfo>[]>;
  allPlist: Extended<PackinglistInfo>;
  constructor(afs: AngularFirestore, private activeStoreService: ActiveStoreService) {
    super(afs, activeStoreService, StorePathConfig.PackinglistInfo);
    this.allPlist = { id: undefined, data: { name: 'ALL' } } as Extended<PackinglistInfo>;
    this.ListWithNewEmptyPackingInfo = this.List.pipe(map(plists => [this.allPlist, ...plists]));
  }
  get(id) {
    if (!id) {
      return of(this.allPlist);
    } else {
      return super.get(id);
    }
  }

}
