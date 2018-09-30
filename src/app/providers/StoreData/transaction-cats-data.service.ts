import { Injectable } from "@angular/core";
import { StoreDataService } from "./store-data.service";
import { TransactionCatigory, Extended } from "../../interfaces/data-models";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActiveStoreService } from "../AppData/active-store.service";
import { StorePathConfig } from "../../interfaces/StorePathConfig";
import { map, publishReplay, refCount } from "rxjs/operators";
import { mapToTree } from "../../Util/map-to-tree";

@Injectable({
  providedIn: "root"
})
export class TransactionCatsDataService extends StoreDataService<
  TransactionCatigory
> {
  treeRoot;

  constructor(afs: AngularFirestore, activeStoreService: ActiveStoreService) {
    super(afs, activeStoreService, StorePathConfig.TransactionCatigories);
    this.treeRoot = this.dataMap.pipe(
      map(tCatigoriesMap => {
        return mapToTree(tCatigoriesMap) as Extended<TransactionCatigory>;
      }),
      publishReplay(1),
      refCount()
    );
    console.log(
      "Helloooooo TCatigoriesFsRepositoryProvider FBRepository Provider"
    );
  }
}
