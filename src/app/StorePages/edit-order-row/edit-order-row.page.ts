import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { ProductsDataService } from "../../providers/StoreData/products-data.service";
import {
  OrderRow,
  Extended,
  Product,
  PackingLine,
  OrderRow2,
  OrderRowExt
} from "../../interfaces/data-models";
import { Observable, Subscription, of, merge } from "rxjs";
import { take } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { ModalController, NavParams } from "@ionic/angular";
import { ProductPickerComponent } from "../../shared/product-picker/product-picker.component";

@Component({
  selector: "app-edit-order-row",
  templateUrl: "./edit-order-row.page.html",
  styleUrls: ["./edit-order-row.page.scss"]
})
export class EditOrderRowPage implements OnInit, AfterViewInit {

  product: Extended<Product>;
  submitAttempt: boolean;
  pLLine: Extended<OrderRow>;
  orderRow: Extended<OrderRow2>;
  pLLine$: Observable<Extended<OrderRow>>;
  form: FormGroup;
  pLineId: string;
  subscribtions: Subscription[] = [];
  sub: Subscription;
  @ViewChild('productPicker', { static: false }) productPicker: ProductPickerComponent;

  constructor(
    private fb: FormBuilder,
    private productsFsRep: ProductsDataService,
    private modalController: ModalController,
    private navParams: NavParams
  ) {
    this.orderRow = this.navParams.get("orderRow");
    this.form = this.fb.group({
      productId: ["", Validators.required],
      qty: ["", [Validators.required, Validators.min(0)]],
      price: ["", [Validators.required, Validators.min(0)]],
      ammount: ["", [ Validators.required, Validators.min(0)]],
      packingLines: this.fb.array([]),
      notice: ""
    });
    this.sub = merge(
      this.qtyControl.valueChanges,
      this.priceControl.valueChanges
    ).subscribe(qty => {
      const ammount = Number(this.qtyControl.value) * Number(this.priceControl.value);
      this.ammountControl.setValue(ammount);
    });



    this.form.patchValue(this.orderRow.data);
    this.patchLines(this.orderRow.data.packingLines);

    if (this.orderRow.data.productId) {
      this.productsFsRep.getOnce(this.orderRow.data.productId).then(product => {
        this.orderRow.ext.Product = product;
        this.product = product;
      });
    }


    const sub = this.productIdControl.valueChanges.subscribe(productId => {
      if (productId) {
        this.extendOrderRow(productId);
      }
    });
    this.subscribtions.push(sub);
  }

  ngAfterViewInit(): void {
    if (!this.orderRow.data.productId) {
      this.productPicker.selectProduct(null);
    }
  }
  private extendOrderRow(productId: any) {
    this.productsFsRep.getOnce(productId).then(product => {
      this.product = product;
      this.orderRow.ext = { ...this.orderRow.ext, Product: product };
      if (this.product.data.price && !this.priceControl.value) {
        this.priceControl.setValue(this.product.data.sPrice);
      }
    });
  }

  createPackingLine(): FormGroup {
    let shippingMark = "";
    if (this.product) {
      shippingMark = this.product.data.code;
    }
    return this.fb.group({
      ctnNo: "",
      shippingMark: shippingMark,
      ctns: ["", Validators.min(1)],
      packing: Validators.min(0)
    });
  }
  patchLines(pls: PackingLine[]) {
    if (!pls) {
      return;
    }
    pls.forEach(pl => {
      const fg = this.createPackingLine();
      fg.patchValue(pl);
      this.packingLines.push(fg);
    });
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

  dismiss(data: Extended<OrderRow2>, role: string) {
    this.modalController.dismiss(data, role);
  }

  onCancel() {
    return this.dismiss(null, "cancel");
  }
  onSubmit({ value, valid }: { value: OrderRow2; valid: boolean }) {
    console.log(value, valid);
    this.submitAttempt = true;
    if (valid) {
      this.onSave(value);
    }
    // throw "please take care , invalid form"
  }
  onDelete() {
    return this.dismiss(null, "delete");
  }
  onSave(editedOrdeRow: OrderRow2) {
    const extPLLine = { data: editedOrdeRow, ext: this.orderRow.ext } as Extended<
      OrderRow2
    >;
    const oldState = this.orderRow.ext.state || "NONE";
    switch (oldState) {
      case "EMPTY":
        extPLLine.ext.state = "NEW";
        break;
      case "NONE":
        extPLLine.ext.state = "EDITED";
        break;
      case "ADDED":
      case "NEW":
      case "EDITED":
        extPLLine.ext.state = oldState;
        break;
      default:
        throw new Error(`Inavlid orderRow state: '${oldState}'`);
    }

    this.dismiss(extPLLine, "save");
  }
  ngOnInit() { }
}
