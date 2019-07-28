import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { constructor, reject } from "q";
import { AuthService } from "../../providers/Auth/auth.service";
// import { UserStoresService } from "../../providers/AppData/user-stores.service";
import { ActiveStoreService } from "../../providers/AppData/active-store.service";
import { UserStore, Extended, StoreInfo } from "../../interfaces/data-models";
import { StoreDataService } from "../../providers/StoreData/store-data.service";
import { UserPendingStoresService } from "../../providers/AppData/user-pending-stores.service";
import { StoreInfoService } from "../../providers/AppData/store-info.service";
// import { InvitesService } from "../../providers/AppData/invites.service";
import { take, mergeMap } from "rxjs/operators";
import { Router } from "@angular/router";
import { UserStoresService } from "../../providers/AppData/user-stores.service";

@Component({
  selector: "app-user-stores",
  templateUrl: "./user-stores.page.html",
  styleUrls: ["./user-stores.page.scss"]
})
export class UserStoresPage implements OnInit {
  userStores: Observable<Extended<UserStore>[]>;
//  userStores: Observable<Extended<StoreInfo>[]>;
  userPendingStores: Observable<Extended<UserStore>[]>;

  constructor(
    public router: Router,
    // tslint:disable-next-line:no-shadowed-variable
    private auth: AuthService,
     private userStoresFsRepository: UserStoresService,
    // private userPendingStoresFsRepository: UserPendingStoresService,
    private storesFsRepository: StoreInfoService,
    // private invitesFsRepository: InvitesService,
    private activeStoreServise: ActiveStoreService
  ) {
    // this.userStores = this.auth.user.pipe(
    //   mergeMap(user => {
    //     return this.storesFsRepository.getUserStores(user.uid);
    //   })
    // );
     this.userStores = this.userStoresFsRepository.list;
    // this.userPendingStores = this.userPendingStoresFsRepository.FormatedList;
  }
  /*
  createNewStore() {
    return this.auth.user.pipe(take(1)).subscribe(user => {
      return this.storesFsRepository.createNewStore(user.uid);
    });
  }
  */

  async onStoreSelected(extStore: Extended<UserStore>) {
    await this.activeStoreServise.setActiveStoreKey(extStore.id);
    this.router.navigateByUrl("StoreBase/ProductsList");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad UserStoresPage");
  }
  accept(inviteId: string) {
  //  this.invitesFsRepository.accpetInvite(inviteId);
  }
  reject(inviteId: string) {
  //  this.invitesFsRepository.rejectInvite(inviteId);
  }

  ngOnInit() {}
}
