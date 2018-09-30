import { Editable } from "../../interfaces/data-models";
import { FirestoreData } from "../AppData/firestore-data";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActiveStoreService } from "../AppData/active-store.service";
import { conatctPaths } from "../../Util/contact-paths";
import { StorePathConfig } from "../../interfaces/StorePathConfig";

export class StoreDataService<T extends Editable> extends FirestoreData<T> {
  constructor(
    afs: AngularFirestore,
    ass: ActiveStoreService,
    dataSubPath: string
  ) {
    super(
      afs,
      conatctPaths(StorePathConfig.basePath, ass.activeStoreKey, dataSubPath)
    );
  }
}
