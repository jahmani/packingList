import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Extended, StoreInfo } from "../../interfaces/data-models";
import { ActiveStoreService } from "../../providers/AppData/active-store.service";
import { StoreInfoService } from "../../providers/AppData/store-info.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { switchMap, tap, map, mergeMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { AuthService } from "../../providers/Auth/auth.service";

@Component({
  selector: "app-edit-store-info",
  templateUrl: "./edit-store-info.page.html",
  styleUrls: ["./edit-store-info.page.scss"]
})
export class EditStoreInfoPage {
  form: FormGroup;
  submitAttempt = false;
  storeDoc: Extended<StoreInfo>;
  storeId: string;
  storeDoc$: Observable<Extended<StoreInfo>>;

  constructor(
    private fb: FormBuilder,
    private storesFsRepository: StoreInfoService,
    private activeStoreService: ActiveStoreService,
    private authService: AuthService,
    public router: Router,
    private location: Location,
    public rout: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)])
      ],
      currency: ["", Validators.compose([Validators.required])],
      code: "",
      users: ""
    });

    this.storeDoc$ = this.rout.paramMap.pipe(
      mergeMap(paramMap => {
        const paramStoreId = paramMap.get("id");
        if (!paramStoreId) {
          const storeDoc = this.activeStoreService.activeStoreKey$.pipe(switchMap(
            activeStoreId => this.storesFsRepository.get(activeStoreId)));
          return storeDoc;
        } else if (paramStoreId === "new") {
          return this.authService.user.pipe(
            map(user => {
              const uid = user.uid;
              const newStoreInfo: StoreInfo = {
                name: "NewStore",
                code: "new",
                users: [uid]
              } as StoreInfo;
              const extNewStore: Extended<StoreInfo> = {
                data: newStoreInfo
              } as Extended<StoreInfo>;
              return extNewStore;
            })
          );
        }
      }),
      tap(str => {
        this.storeDoc = str;
        this.form.patchValue(this.storeDoc.data);
      })
    );
  }

  get nameCtrl() {
    return this.form.get("name");
  }
  get currencyCtrl() {
    return this.form.get("currency");
  }
  dismiss() {
    this.location.back();
  }
  onCancel() {
    this.dismiss();
  }
  onSubmit({ value, valid }: { value: StoreInfo; valid: boolean }) {
    if (valid) {
      const updatedStoreDoc = {
        ...this.storeDoc,
        data: { ...value }
      };
      if (this.storeDoc.id) {
        this.storesFsRepository.saveOld(updatedStoreDoc);
      } else {
        this.storesFsRepository.saveNew(updatedStoreDoc);
      }
      return this.dismiss();
    }
  }

}
