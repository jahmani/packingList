import { Component, OnInit, Optional } from "@angular/core";
import { Extended, Product } from "../../interfaces/data-models";
import { Observable, of } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NavController, NavParams } from "@ionic/angular";
import { take, map, switchMap, tap } from "rxjs/operators";
import { ProductsDataService } from "../../providers/StoreData/products-data.service";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

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
    @Optional() public navParams: NavParams,
    private rout: ActivatedRoute,
    private location: Location
  ) {
    // this.productId = this.navParams.get("productId");
    // this.productId = this.rout.snapshot.paramMap.get("productId");
    this.productId$ = this.rout.paramMap.pipe(
      map(value => {
        return value.get("id");
      })
    );

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
      thumbUrl: ""
    });
    this.product$ = this.productId$.pipe(
      switchMap(pId => {
        if (pId === "new") {
          const newProduct: Product = {} as Product;
          return of({ data: newProduct, id: null } as Extended<Product>);
        } else {
          return this.productsFsRep.get(pId);
        }
      }),
      tap( prod => {
        this.productId = prod.id;
        this.form.patchValue(prod.data);
      })
    );
  }

  get nameCtrl() {
    return this.form.get("name");
  }


  dismiss(data) {
    this.location.back();
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
    if (this.productId) {
      extProduct.id = this.productId;
      this.productsFsRep.saveOld(extProduct);
    } else {
      this.productsFsRep.saveNew(extProduct);
    }

    this.dismiss(extProduct);
  }

  ngOnInit() {}
}
