import { Component, OnInit } from "@angular/core";
import { Extended, Product } from "../../interfaces/data-models";
import { Observable, of } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NavParams, ModalController } from "@ionic/angular";
import { tap } from "rxjs/operators";
import { ProductsDataService } from "../../providers/StoreData/products-data.service";

@Component({
  selector: "app-edit-product",
  templateUrl: "./edit-product.page.html",
  styleUrls: ["./edit-product.page.scss"]
})
export class EditProductPage implements OnInit {
  submitAttempt: boolean;
  product$: Observable<Extended<Product>>;
  form: FormGroup;
  productId: string;
  productId$: Observable<string>;
  constructor(
    private fb: FormBuilder,
    private productsFsRep: ProductsDataService,
    private navParams: NavParams,
    private modalControler: ModalController
  ) {
    // this.productId = this.navParams.get("productId");
    // this.productId = this.rout.snapshot.paramMap.get("productId");
    this.productId = this.navParams.get("id");
    const copy = this.navParams.get("copy");

    this.form = this.fb.group({
      name: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40)
        ])
      ],
      code: "",
      style: "",
      notice: "",
      thumbUrl: "",
      price: "",
      unit: ["pcs", Validators.maxLength(5)]
    });
    if (this.productId === "new") {
      const newProduct: Product = {...copy} as Product;
      this.product$ = of({ data: newProduct, id: null } as Extended<Product>);
    } else {
      this.product$ = this.productsFsRep.get(this.productId);
    }

    this.product$ = this.product$.pipe(
      tap(prod => {
        this.productId = prod.id;
        this.form.patchValue(prod.data);
      })
    );
  }

  get nameCtrl() {
    return this.form.get("name");
  }

  dismiss(data) {
    this.modalControler.dismiss(data);
  }
  onCancel() {
    return this.dismiss(null);
  }
  onSubmit({ value, valid }: { value: Product; valid: boolean }) {
    console.log(value, valid);
    this.submitAttempt = true;
    if (valid) {
      this.onSave(value);
    }
    // throw "please take care , invalid form"
  }

  onSave(product: Product) {
    const extProduct = { data: product } as Extended<Product>;
    if (this.productId && this.productId !== "new") {
      extProduct.id = this.productId;
      this.productsFsRep.saveOld(extProduct);
    } else {
      this.productsFsRep.saveNew(extProduct);
    }

    this.dismiss(extProduct);
  }

  ngOnInit() {}
}
