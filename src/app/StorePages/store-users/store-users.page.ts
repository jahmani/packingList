import { Component, OnInit } from '@angular/core';
import { StoreUsersDataService } from '../../providers/StoreData/store-users-data.service';
import { Observable } from 'rxjs';
import { Extended, StoreUser, User } from '../../interfaces/data-models';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../../providers/AppData/users.service';
import { userInfo } from 'os';
import { UserStoresService } from '../../providers/AppData/user-stores.service';
import { ActiveStoreService } from '../../providers/AppData/active-store.service';
import { StoreInfoService } from '../../providers/AppData/store-info.service';

@Component({
  selector: 'app-store-users',
  templateUrl: './store-users.page.html',
  styleUrls: ['./store-users.page.scss'],
})
export class StoreUsersPage implements OnInit {

  showInviteNewUser = false;
  storeUsers: Observable<Extended<StoreUser>[]>;
  foundUser: Observable<Extended<User>>;
  phoneNumberCtrl: FormControl;
  emailCtrl: FormControl;
  searchBy: any;
  constructor(private storeUsersDataService: StoreUsersDataService,
    fb: FormBuilder, private us: UsersService,
    private userStoresService: UserStoresService,
    private as: ActiveStoreService,
    private sinfoS: StoreInfoService) {
    this.storeUsers = this.storeUsersDataService.list;
    this.phoneNumberCtrl = fb.control("", [Validators.required, Validators.minLength(5)]);
    this.emailCtrl = fb.control("", [Validators.required, Validators.email]);
  }
  segmentChanged(ev: any) {
    this.searchBy = ev.detail.value;
    console.log('Segment changed', ev.detail.value);
  }
  lookup() {
    if (this.searchBy === "byPhone") {
      this.lookupPhoneNumber();
    } else {
      this.lookupEmail();
    }
  }
  lookupPhoneNumber() {
    const phoneNumber = this.phoneNumberCtrl.value;
    this.foundUser = this.us.getByPhoneNumber(phoneNumber);
  }
  lookupEmail() {
    const email = this.emailCtrl.value;
    this.foundUser = this.us.getByEmail(email);
  }
  async invite(user: Extended<User>) {
    const storeUser: StoreUser = { userInfo: user.data, isEnabled: false, canRead: false, canWrite: false } as unknown as StoreUser;
    const asid = await this.as.getlatest();
    this.sinfoS.getOnce(asid).then(esi => {
      this.userStoresService.invite(user.id, esi.data, asid);
    });
    return this.storeUsersDataService.saveNew({ id: user.id, data: storeUser }, user.id);
  }
  ngOnInit() {
  }

}
