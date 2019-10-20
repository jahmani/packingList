import { Component, OnInit } from "@angular/core";
import { PackinglistInfoDataService } from "../../providers/StoreData/packinglist-info-data.service";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, of } from "rxjs";
import { PackinglistInfo, Extended } from "../../interfaces/data-models";
import { map, switchMap, tap } from "rxjs/operators";

@Component({
  selector: "app-edit-packinglist-info",
  templateUrl: "./edit-packinglist-info.page.html",
  styleUrls: ["./edit-packinglist-info.page.scss"]
})
export class EditPackinglistInfoPage implements OnInit {
  packinglistId$: Observable<string>;
  submitAttempt: boolean;
  packinglistId: string;
  packinglist$: Observable<Extended<PackinglistInfo>>;
  form: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private packinglistInfoDataService: PackinglistInfoDataService,
    private location: Location,
    private router: Router
  ) {
    this.form = this.fb.group({
      date: "",
      deliveryDate: "",
      notice: "",
      name: ['', Validators.required],
      deliveryAdress: ""
    });
    this.packinglistId$ = this.route.paramMap.pipe(
      map(value => {
        return value.get("id");
      })
    );
    this.packinglist$ = this.packinglistId$.pipe(
      switchMap(plId => {
        if (plId === "new") {
          const newPl: PackinglistInfo = {} as PackinglistInfo;
          return of({ data: newPl, id: null } as Extended<PackinglistInfo>);
        } else {
          return this.packinglistInfoDataService.get(plId);
        }
      }),
      tap(pl => {
        this.packinglistId = pl.id;
        this.form.patchValue(pl.data);
      })
    );
  }

  dismiss(data: Extended<PackinglistInfo>) {
      return this.location.back();
  }
  onCancel() {
    return this.dismiss(null);
  }
  onSubmit({ value, valid }: { value: PackinglistInfo; valid: boolean }) {
    console.log(value, valid);
    this.submitAttempt = true;
    if (valid) {
      this.onSave(value);
    }
    // throw "please take care , invalid form"
  }

  async onSave(packinglist: PackinglistInfo) {
    const extPackinglist = { data: packinglist } as Extended<PackinglistInfo>;
    if (this.packinglistId) {
      extPackinglist.id = this.packinglistId;
      this.packinglistInfoDataService.saveOld(extPackinglist);
    } else {
      const newId = await this.packinglistInfoDataService.newKey();
      extPackinglist.id = newId;
      this.packinglistInfoDataService.saveNew(extPackinglist, newId);
    }
    this.dismiss(extPackinglist);
  }

  ngOnInit() {}
}
