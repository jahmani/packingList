import { Injectable } from "@angular/core";
import { Observable, combineLatest } from "rxjs";
import { UserStore, Extended, StoreInfo } from "../../interfaces/data-models";
import { AngularFirestore } from "@angular/fire/firestore";
import { map, mergeMap, startWith } from "rxjs/operators";
import { FirestoreData } from "./firestore-data";
import { StoreInfoService } from "./store-info.service";
import { AuthService } from "../Auth/auth.service";
import { conatctPaths } from "../../Util/contact-paths";

@Injectable({
  providedIn: "root"
})
export class UserStoresService {
  fsRep$: Observable<FirestoreData<UserStore>>;
  constructor(
    afs: AngularFirestore,
    auth: AuthService,
    private storeInfoFsRepository: StoreInfoService
  ) {
    console.log("Hello UserStoresFsRepository Provider");
    this.fsRep$ = auth.user.pipe(
      map(user => {
        if (user) {
          return new FirestoreData(
            afs,
            conatctPaths("users", user.uid, "stores")
          );
        } else {
          return null;
        }
      })
    );
  }
  List() {
    return this.fsRep$.pipe(mergeMap(fsRep => fsRep && fsRep.List()));
  }
  get FormatedList(): Observable<Extended<UserStore>[]> {
    return this.List().pipe(
      mergeMap(stores => {
        //  return Promise.all(this.getStores(stores));
        return combineLatest(this.getStores(stores));
      }),
      map(extUserStoreArray =>
        extUserStoreArray.filter(extUserStore => extUserStore.ext.store)
      )
    );
  }
  getStores(extUserStores: Extended<UserStore>[]) {
    const emptyStoreInfo: Partial<StoreInfo> = { name: "empty", code: "empty" };
    return extUserStores.map(extUserStore => {
      return this.storeInfoFsRepository.get(extUserStore.id).pipe(
      //  startWith({ data: emptyStoreInfo  }),
        map(store => {
          extUserStore.ext.store = store.data as StoreInfo;
          return extUserStore;
        })
      );
    });
  }

  getSingleOrDefault(): Observable<Extended<UserStore>> {
    return this.FormatedList.pipe(
      map(extUserStores => {
        if (extUserStores.length === 1) {
          return extUserStores[0];
        }
        extUserStores.forEach(extUserStore => {
          if (extUserStore.data.isDefault) {
            return extUserStore;
          }
        });
        return null;
      })
    );
  }
}
