import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { constructor, reject } from "q";
import { NavController } from "@ionic/angular";
import { auth } from "firebase";
import { AuthService } from "../../providers/Auth/auth.service";
import { UserStoresService } from "../../providers/AppData/user-stores.service";
import { ActiveStoreService } from "../../providers/AppData/active-store.service";
import { UserStore, Extended } from "../../interfaces/data-models";
import { StoreDataService } from "../../providers/StoreData/store-data.service";
import { UserPendingStoresService } from "../../providers/AppData/user-pending-stores.service";
import { StoreInfoService } from "../../providers/AppData/store-info.service";
import { InvitesService } from "../../providers/AppData/invites.service";
import { take } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: "app-user-stores",
  templateUrl: "./user-stores.page.html",
  styleUrls: ["./user-stores.page.scss"]
})
export class UserStoresPage implements OnInit {
  userStores: Observable<Extended<UserStore>[]>;
  userPendingStores: Observable<Extended<UserStore>[]>;

  constructor(
    public router: Router,
    // tslint:disable-next-line:no-shadowed-variable
    private auth: AuthService,
    public userStoresFsRepository: UserStoresService,
    private userPendingStoresFsRepository: UserPendingStoresService,
    private storesFsRepository: StoreInfoService,
    private invitesFsRepository: InvitesService,
    private activeStoreServise: ActiveStoreService
  ) {
    this.userStores = this.userStoresFsRepository.FormatedList;
    this.userPendingStores = this.userPendingStoresFsRepository.FormatedList;
  }

  replicateStoreInfo() {
    this.storesFsRepository.replicateStoreInfo();
  }

  createNewStore() {
    return this.auth.user.pipe(take(1)).subscribe(user => {
      return this.storesFsRepository.createNewStore(user.uid);
    });
  }

  onStoreSelected(extStore: Extended<UserStore>) {
    this.activeStoreServise.setActiveStoreKey(extStore.id);
  //  const accountsPage = { title: "Accounts", component: "AccountsListPage" };

    this.router.navigateByUrl("/StoreBase");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad UserStoresPage");
  }
  accept(inviteId: string) {
    this.invitesFsRepository.accpetInvite(inviteId);
  }
  reject(inviteId: string) {
    this.invitesFsRepository.rejectInvite(inviteId);
  }

  ngOnInit() {}
}
