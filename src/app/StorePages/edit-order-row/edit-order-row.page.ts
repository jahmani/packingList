import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { OrderRowsService } from "../../providers/StoreData/order-rows.service";
import { ProductsDataService } from "../../providers/StoreData/products-data.service";
import { OrderRow, Extended, Product, PackingLine } from "../../interfaces/data-models";
import { Observable, Subscription, of } from "rxjs";
import { take } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-edit-order-row",
  templateUrl: "./edit-order-row.page.html",
  styleUrls: ["./edit-order-row.page.scss"]
})
export class EditOrderRowPage implements OnInit {
  product: Extended<Product>;
  submitAttempt: boolean;
  pLLine: Extended<OrderRow>;
  pLLine$: Observable<Extended<OrderRow>>;
  form: FormGroup;
  pLineId: string;
  subscribtions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private pLLinesFsRep: OrderRowsService,
    private productsFsRep: ProductsDataService,
    private rout: ActivatedRoute,
    private location: Location
  ) {
    this.pLineId = this.rout.snapshot.paramMap.get("lineId");
    this.form = this.fb.group({
      orderId: ["", Validators.required],
      productId: ["", Validators.required],
      qty: ["", Validators.required],
      price: ["", Validators.required],
      ammount: ["", Validators.required],
      packingLines: this.fb.array([]),
      notice: "",
    });

    if (this.pLineId) {
      this.pLLine$ = this.pLLinesFsRep.get(this.pLineId);
    } else {
      const orderId = this.rout.snapshot.paramMap.get("orderId");
      const plLineData = { orderId } as OrderRow;
      this.pLLine$ = of({ data: plLineData, id: null } as Extended<OrderRow>);
    }
    this.pLLine$.pipe(take(1)).subscribe(extPLLine => {
      this.pLLine = extPLLine;
      this.form.patchValue(this.pLLine.data);
      // this.packingLines.setValue(extPLLine.data.packingLines);
      this.patchLines(extPLLine.data.packingLines);
    });
    this.subscribtions.push(
      this.qtyControl.valueChanges.subscribe(() => this.recalculateAmmount())
    );
    this.subscribtions.push(
      this.priceControl.valueChanges.subscribe(() => this.recalculateAmmount())
    );



    const sub = this.productIdControl.valueChanges.subscribe(productId => {
      if (productId) {
        this.productsFsRep.getOnce(productId).then(product => {
          this.product = product;
        });
      }
    });
    this.subscribtions.push(sub);
  }
  createPackingLine(): FormGroup {
    return this.fb.group({
      ctnNo: "",
      shippingMark: "",
      ctns: ["", Validators.min(1)],
      packing: Validators.min(0)
    });
  }
  patchLines(pls: PackingLine[]) {
    if (!pls) {return; }
    pls.forEach((pl => {
      const fg = this.createPackingLine();
      fg.patchValue(pl);
      this.packingLines.push(fg);
    }));

  }
  addPackingLine() {
    this.packingLines.push(this.createPackingLine());
  }
  deletePackingLine(i: number) {
    this.packingLines.removeAt(i);
  }
  get packingLines() {
    return this.form.get("packingLines") as FormArray;
  }

  get productIdControl() {
    return this.form.get("productId");
  }
  get qtyControl() {
    return this.form.get("qty");
  }
  get priceControl() {
    return this.form.get("price");
  }
  get ammountControl() {
    return this.form.get("ammount");
  }
  recalculateAmmount(): void {
    const qty = this.qtyControl.value || 0;
    const price = this.priceControl.value || 0;
    this.ammountControl.setValue(qty * price);
  }
  recalculateQuantity(): void {
    /*
    const ctns = this.ctnsControl.value || 0;
    const packing = this.packingControl.value || 0;
    if (packing && ctns) {
      this.qtyControl.setValue(ctns * packing);
    }
    */
  }

  ionViewDidLoad() {
    //// this.form.patchValue(this.pLLine)
  }

  ionViewWillUnload() {
    this.subscribtions.forEach(sub => sub.unsubscribe());
  }

  dismiss(data?) {
    this.location.back();
  }

  onCancel() {
    return this.dismiss(null);
  }
  onSubmit({ value, valid }: { value: OrderRow; valid: boolean }) {
    console.log(value, valid);
    this.submitAttempt = true;
    if (valid) {
      this.onSave(value);
    }
    // throw "please take care , invalid form"
  }
  onDelete() {
    if (this.pLineId) {
      this.pLLinesFsRep.remove(this.pLLine).then(() => this.dismiss());
    }
  }
  onSave(pLLine: OrderRow) {
    const extPLLine = { data: pLLine } as Extended<OrderRow>;
    if (this.pLLine.id) {
      extPLLine.id = this.pLLine.id;
      this.pLLinesFsRep.saveOld(extPLLine);
    } else {
      this.pLLinesFsRep.saveNew(extPLLine);
    }

    this.dismiss(extPLLine);
  }
  ngOnInit() {}
}
