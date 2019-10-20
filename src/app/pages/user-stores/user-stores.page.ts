import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { ActiveStoreService } from "../../providers/AppData/active-store.service";
import { UserStore, Extended, StoreUser } from "../../interfaces/data-models";
import { Router } from "@angular/router";
import { UserStoresService } from "../../providers/AppData/user-stores.service";
import { StoreUsersDataService } from "../../providers/StoreData/store-users-data.service";

@Component({
  selector: "app-user-stores",
  templateUrl: "./user-stores.page.html",
  styleUrls: ["./user-stores.page.scss"]
})
export class UserStoresPage {
  userStores: Observable<Extended<UserStore>[]>;
  userPendingStores: Observable<Extended<UserStore>[]>;

  constructor(
    public router: Router,
    private userStoresFsRepository: UserStoresService,
    private storeUsersFsRepository: StoreUsersDataService,
    private activeStoreServise: ActiveStoreService
  ) {
    this.userStores = this.userStoresFsRepository.List;
  }

  async onStoreSelected(extStore: Extended<UserStore>) {
    await this.activeStoreServise.setActiveStoreKey(extStore.id);
    this.router.navigateByUrl("StoreBase/ProductsList");
  }
  accept(extStore: Extended<UserStore>) {
    const copy = {...extStore, data: {...extStore.data}};
    copy.data.status = "ACTIVE";
    this.userStoresFsRepository.saveOld(copy);

    const storeUserData: StoreUser = {canRead: true, isEnabled: true, isAdmin: false}  as StoreUser;
    const storeUser: Extended<StoreUser> = {id: null, data: storeUserData};
    //  this.invitesFsRepository.accpetInvite(inviteId);
  }
  reject(inviteId: string) {
    //  this.invitesFsRepository.rejectInvite(inviteId);
  }
}
