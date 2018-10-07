import { Component, OnInit } from "@angular/core";
import { Extended, AccountInfo } from "../../../interfaces/data-models";
import { AccountsDataService } from "../../../providers/StoreData/accounts-data.service";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { map, switchMap, tap } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";
import { of } from "rxjs";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";

@Component({
  selector: "app-edit-account",
  templateUrl: "./edit-account.page.html",
  styleUrls: ["./edit-account.page.scss"]
})
export class EditAccountPage implements OnInit {
  form: FormGroup;
  submitAttempt = false;

  account$: Observable<Extended<AccountInfo>>;
  accountId: string;
  accountName: string;
  constructor(
    public location: Location,
    private afsr: AccountsDataService,
    public rout: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.account$ = this.rout.paramMap.pipe(
      switchMap(data => {
        this.accountId = data.get("id");
        if (this.accountId !== "new") {
          return this.afsr.get(this.accountId);
        } else {
          this.accountId = null;
          return of({ id: null, data: {} as AccountInfo });
        }
      })
    );
    this.form = this.fb.group({
      name: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(50)])
      ],
      city: "",
      mobile: ""
    });
    this.account$ =
    this.account$.pipe(
      tap(account => {
        if (account) {
          this.accountName = account.data.name;
          this.form.patchValue(account.data);
        }
      })
    );
    //  console.log(this.accSnapshot);
    //  this.accountId = this.accSnapshot.id;
  }

  get nameControl(): FormControl {
    return this.form.get("name") as FormControl;
  }
  onSubmit({ value, valid }: { value: AccountInfo; valid: boolean }) {
    console.log(value, valid);
    this.submitAttempt = true;
    if (valid) {
      this.onSave(value);
    }
    // throw "please take care , invalid form"
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad EditAccountPage");
  }
  dismiss(data) {
    // let data = { account: this.account };
    this.location.back();
  }
  onCancel() {
    return this.dismiss(null);
  }
  private prepairForSave(value: AccountInfo): Extended<AccountInfo> {
    return { id: this.accountId, data: value };
  }
  onSave(accSnapshot: AccountInfo) {
    const extendedAccount = this.prepairForSave(accSnapshot);
    if (!this.accountId) {
      this.afsr.saveNew(extendedAccount);
      this.dismiss(extendedAccount);
    } else {
      this.afsr.saveOld(extendedAccount);
      this.dismiss(extendedAccount);
    }
  }
  ngOnInit() {}
}
