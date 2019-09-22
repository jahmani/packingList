import { Component, OnInit, Optional } from "@angular/core";
import { Extended, Product } from "../../interfaces/data-models";
import { Observable, of } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NavParams, ModalController, PopoverController, AlertController } from "@ionic/angular";
import { tap } from "rxjs/operators";
import { ProductsDataService } from "../../providers/StoreData/products-data.service";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { PageActions } from "../../shared/edit-options-popover/edit-options-popover.component";

@Component({
  selector: "app-edit-product",
  templateUrl: "./edit-product.page.html",
  styleUrls: ["./edit-product.page.scss"]
})
export class EditProductPage implements OnInit {
  actions = [PageActions.SAVE, PageActions.DELETE];

  submitAttempt: boolean;
  product$: Observable<Extended<Product>>;
  form: FormGroup;
  productId: string;
  productId$: Observable<string>;
  isModal: boolean;
  constructor(
    private fb: FormBuilder,
    private productsFsRep: ProductsDataService,
    @Optional() private navParams: NavParams,
    private modalControler: ModalController,
    // public popoverController: PopoverController,
    private alertController: AlertController,
    activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    let copy: Extended<Product> = { data: {}, id: null, ext: {} } as Extended<Product>;
    if (this.navParams) {
      this.isModal = !!this.navParams; // .get("isModal");
      this.productId = this.navParams.get("id");
       copy = this.navParams.get('copy') || copy;
    } else {
      this.productId = activatedRoute.snapshot.paramMap.get("id");
    }
    // this.isModal = !!this.navParams; // .get("isModal");
    // this.productId = this.navParams.get("id");

    // const copy = this.navParams.get("copy");

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
      price: [0, Validators.min(0)],
      sPrice: [0, Validators.min(0)],
      size: "",
      unit: ["pcs", Validators.maxLength(5)]
    });
    if (this.productId === "new") {
     // const newProduct: Product = {} as Product;
      this.product$ = of(copy);
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
    // this.modalControler.dismiss(data);
    if (this.isModal) {
      return this.modalControler.dismiss();
    } else {
      this.location.back();
    }
  }
  onCancel() {
    return this.dismiss(null);
  }
  async delete(product: Product) {
    const extProduct = { data: product } as Extended<Product>;
    if (this.productId && this.productId !== "new") {
      extProduct.id = this.productId;
      const modal = await this.alertController.create({
        message: `Are you sure deleting product: ${extProduct.data.name}`,
        header: `Deleteing Product`,
        buttons: [
          {
            text: "Delete",
            handler: () => {
              this.productsFsRep.remove(extProduct);
              this.dismiss(extProduct);
            }
          },
          { text: "cancel", cssClass: "danger" }
        ]
      });
      return await modal
        .present()
        .then(val => {
          console.log("val", val);
        })
        .catch(console.log);
    } else {
      this.dismiss({});
    }

  }

  onSubmit({ value, valid }: { value: Product; valid: boolean }) {
    console.log(value, valid);
    this.submitAttempt = true;
    if (valid) {
      this.onSave(value);
    }
    // throw "please take care , invalid form"
  }
  onAction(action) {
    switch (action) {
      case PageActions.SAVE:
        this.onSubmit({ value: this.form.value, valid: this.form.valid });
        break;
      case PageActions.SAVECOPY:
        this.saveCopy({ value: this.form.value, valid: this.form.valid });
        break;
      case PageActions.DELETE:
        this.delete(this.form.value);
        break;

      default:
        break;
    }
  }
  // async omMoreClicked(ev) {
  //   const popOver = await this.popoverController.create({
  //     component: EditOptionsPopoverComponent,
  //     componentProps: {
  //     },
  //     event: ev,
  //   });
  //   await popOver.present();
  //   popOver.onDidDismiss().then((val) => {
  //     const action = val.role as unknown as PageActions;
  //     switch (action) {
  //       case PageActions.SAVE:
  //         this.onSubmit({ value: this.form.value, valid: this.form.valid });
  //         break;
  //       case PageActions.SAVECOPY:
  //         this.saveCopy({ value: this.form.value, valid: this.form.valid });
  //         break;
  //       case PageActions.DELETE:
  //         this.delete(this.form.value);
  //         break;

  //       default:
  //         break;
  //     }
  //   });

  // }
  saveCopy({ value, valid }: { value: Product; valid: boolean }) {
    this.submitAttempt = true;
    if (valid) {
      const extProduct = { data: value } as Extended<Product>;
      this.productsFsRep.saveNew(extProduct);
      this.dismiss(extProduct);
    }
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

  ngOnInit() { }
}
