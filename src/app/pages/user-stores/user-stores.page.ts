import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { ActiveStoreService } from "../../providers/AppData/active-store.service";
import { UserStore, Extended } from "../../interfaces/data-models";
import { Router } from "@angular/router";
import { UserStoresService } from "../../providers/AppData/user-stores.service";

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
    private activeStoreServise: ActiveStoreService
  ) {
    this.userStores = this.userStoresFsRepository.List;
  }

  async onStoreSelected(extStore: Extended<UserStore>) {
    await this.activeStoreServise.setActiveStoreKey(extStore.id);
    this.router.navigateByUrl("StoreBase/ProductsList");
  }
  accept(inviteId: string) {
    //  this.invitesFsRepository.accpetInvite(inviteId);
  }
  reject(inviteId: string) {
    //  this.invitesFsRepository.rejectInvite(inviteId);
  }
}
