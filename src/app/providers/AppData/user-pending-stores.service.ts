import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserStore, Extended } from "../../interfaces/data-models";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "../Auth/auth.service";
import { map, mergeMap } from "rxjs/operators";
import { conatctPaths } from "../../Util/contact-paths";
import { AppData } from "./firestore-data";
import { StoreInfoService } from "./store-info.service";

@Injectable({
  providedIn: "root"
})
export class UserPendingStoresService {
  fsRep$: Observable<AppData<UserStore>>;

  constructor(
    afs: AngularFirestore,
    auth: AuthService,
    private storeInfoFsRepository: StoreInfoService
  ) {
    //   super(afs, conatctPaths("users", auth.currentUser.uid, "pendingStores"));

    console.log("Hello UserPendingStoresFsRepositoryProvider Provider");
    this.fsRep$ = auth.user.pipe(
      map(user => {
        if (user) {
          return new AppData(
            afs,
            conatctPaths("users", user.uid, "pendingStores")
          );
        } else {
          return null;
        }
      })
    );
  }
  List() {
    return this.fsRep$.pipe(mergeMap(fsRep => fsRep && fsRep.list));
  }
  get FormatedList(): Observable<Extended<UserStore>[]> {
    return this.List().pipe(
      mergeMap(stores => {
        return Promise.all(this.getStores(this, stores));
      })
    );
  }
  getStores(
    self: UserPendingStoresService,
    extUserStores: Extended<UserStore>[]
  ) {
    return extUserStores.map(extUserStore => {
      return self.storeInfoFsRepository.getOnce(extUserStore.id).then(store => {
        extUserStore.ext.store = store.data;
        return extUserStore;
      });
    });
  }
}
