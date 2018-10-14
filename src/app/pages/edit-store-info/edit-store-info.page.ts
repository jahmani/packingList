import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Extended, StoreInfo } from "../../interfaces/data-models";
import { ActiveStoreService } from "../../providers/AppData/active-store.service";
import { StoreInfoService } from "../../providers/AppData/store-info.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { switchMap, tap } from "rxjs/operators";
import { Observable } from "rxjs";

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
    public router: Router,
    private location: Location,
    public rout: ActivatedRoute,

  ) {
    this.form = this.fb.group({
      name: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)])
      ],
      currency: ["", Validators.compose([Validators.required])]
    });

    const paramStoreId = this.rout.snapshot.paramMap.get("id");
    if (!paramStoreId) {
      const activeStoreId = this.activeStoreService.activeStoreKey;

      router.navigate(["/EditStoreInfo", activeStoreId],{replaceUrl:true});
    }
    this.storeId = paramStoreId ;
    this.storeDoc$ = this.storesFsRepository.get(this.storeId).pipe(tap(str => {
      this.storeDoc = str;
      this.form.patchValue(this.storeDoc.data);
    }));
  }

  get nameCtrl() {
    return this.form.get("name");
  }
  get currencyCtrl() {
    return this.form.get("currency");
  }


  onSubmit({ value, valid }: { value: StoreInfo; valid: boolean }) {
    if (valid) {
      const updatedStoreDoc = {
        ...this.storeDoc,
        data: { ...value }
      };
      return this.storesFsRepository.saveOld(updatedStoreDoc).then(() => {
        this.location.back();
      });
    }
  }
  onCancel() {
    this.location.back();
  }

}
