import { Component, OnInit } from '@angular/core';
import { StoreUsersDataService } from '../../providers/StoreData/store-users-data.service';
import { ActivatedRoute } from '@angular/router';
import { map, tap, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Extended, StoreUser, StoreUserPermesions } from '../../interfaces/data-models';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-store-user',
  templateUrl: './edit-store-user.page.html',
  styleUrls: ['./edit-store-user.page.scss'],
})
export class EditStoreUserPage implements OnInit {
  storeUserId: Observable<string>;
  storeUser: Observable<Extended<StoreUser>>;
  permessions: ["canReadProductImages",
    "canReadProducts",
    "canWriteProductImages",
    "canWriteProducts"
  ];
  permissionsCtrlsGroup: FormGroup;
  _storeUser: Extended<StoreUser>;
  constructor(
    private storeUsersService: StoreUsersDataService,
    private rout: ActivatedRoute,
    fb: FormBuilder,
    private location: Location
  ) {
    this.storeUserId = this.rout.paramMap.pipe(map(m => m.get("id")));
    this.permessions = ["canReadProductImages",
      "canReadProducts",
      "canWriteProductImages",
      "canWriteProducts"
    ];
    this.permissionsCtrlsGroup = fb.group(this.permessions.reduce<{}>((prev, curr) => {
      prev[curr] = false;
      return prev;
    }, {}));
    this.storeUser = this.storeUserId.pipe(
      switchMap(sui => this.storeUsersService.get(sui)),
      tap(su => {
        this._storeUser = { ...su };
        this.permissionsCtrlsGroup.patchValue(su.data.permesions || {});
      }));
  }

  ngOnInit() {
  }
  onSubmit({ value, valid }: { value: StoreUserPermesions; valid: boolean }) {
    this._storeUser.data = { ...this._storeUser.data, permesions: value };
    return this.storeUsersService.saveOld(this._storeUser).then(() => this.location.back());
    console.log(value, valid);
  }
  onCancel() {
    this.location.back();
  }

}
