import { Injectable } from "@angular/core";
import { Observable, combineLatest, of } from "rxjs";
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
export class UserStoresService extends FirestoreData<UserStore>  {
  fsRep$: Observable<FirestoreData<UserStore>>;
  constructor(
    protected afs: AngularFirestore,
    private auth: AuthService,
    private storeInfoFsRepository: StoreInfoService
  ) {
    super(afs, auth.user.pipe(map(user => "users/" + user.uid + "/stores")));
    // super(afs, "users/" + auth.currentUser.uid + "/stores");
    // console.log("Hello UserStoresFsRepository Provider");
    // this.fsRep$ = auth.user.pipe(
    //   map(user => {
    //     if (user) {
    //       return new FirestoreData(
    //         afs,
    //         conatctPaths("users", user.uid, "stores")
    //       );
    //     } else {
    //       return null;
    //     }
    //   })
    // );
  }
  forUser(uid) {
    return new FirestoreData(
      this.afs,
      conatctPaths("users", uid, "stores")
    );
  }

  invite(uid, storeInfo: StoreInfo, key) {
    const us: UserStore = {} as UserStore;
    us.status = "INVITED";
    us.storeInfo = storeInfo;
    this.forUser(uid).saveNew({ data: us } as Extended<UserStore>, key);
  }

  // List() {
  //   return this.fsRep$.pipe(mergeMap(fsRep => fsRep && fsRep.List()));
  // }
  // get FormatedList(): Observable<Extended<UserStore>[]> {
  //   return this.List().pipe(
  //     mergeMap(stores => {
  //       //  return Promise.all(this.getStores(stores));
  //       return combineLatest(this.getStores(stores));
  //     }),
  //     map(extUserStoreArray =>
  //       extUserStoreArray.filter(extUserStore => extUserStore.ext.store)
  //     )
  //   );
  // }
  // getStores(extUserStores: Extended<UserStore>[]) {
  //   const emptyStoreInfo: Partial<StoreInfo> = { name: "empty", code: "empty" };
  //   return extUserStores.map(extUserStore => {
  //     return this.storeInfoFsRepository.get(extUserStore.id).pipe(
  //       //  startWith({ data: emptyStoreInfo  }),
  //       map(store => {
  //         extUserStore.ext.store = store.data as StoreInfo;
  //         return extUserStore;
  //       })
  //     );
  //   });
  // }


  getDefaultStoreKey() {
    return window.localStorage.getItem(this.auth.currentUser.uid + ".DEFAULT_STORE");
  }
  setDefaultStoreKey(newKey) {
    window.localStorage.setItem(this.auth.currentUser.uid + ".DEFAULT_STORE", newKey);
  }


  getFirstOrDefaultID(): Observable<string> {
    const localDefaulteStoreID = this.getDefaultStoreKey();
    if (localDefaulteStoreID) {
      return of(localDefaulteStoreID);
    }
    return this.FormatedList.pipe(
      map(extUserStores => {
        if (extUserStores.length) {
          return extUserStores[0].id;
        }
        // extUserStores.forEach(extUserStore => {
        //   if (extUserStore.data.isDefault) {
        //     return extUserStore;
        //   }
        // });
        return null;
      })
    );
  }
}
