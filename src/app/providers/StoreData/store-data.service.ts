import { Editable } from "../../interfaces/data-models";
import { FirestoreData } from "../AppData/firestore-data";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActiveStoreService } from "../AppData/active-store.service";
import { conatctPaths } from "../../Util/contact-paths";
import { StorePathConfig } from "../../interfaces/StorePathConfig";
import { map, share } from "rxjs/operators";
import { Observable, of } from "rxjs";

export class StoreDataService<T extends Editable> extends FirestoreData<T> {
  constructor(
    public afs: AngularFirestore,
    ass: ActiveStoreService,
    private dataSubPath: string
  ) {
    super(
      afs,
      ass.activeStoreKey$.pipe(
        map(storePath => {
          return conatctPaths(StorePathConfig.basePath, storePath, dataSubPath);
        })
      )
    );
  }
  ForStore(storeId) {
    return new FirestoreData(this.afs, of(conatctPaths(StorePathConfig.basePath, storeId, this.dataSubPath)));
  }
}
