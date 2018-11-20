import { Component, OnInit, Optional } from "@angular/core";
import { Observable, combineLatest } from "rxjs";
import { Extended, Product } from "../../interfaces/data-models";
import { NavParams, AlertController, ModalController } from "@ionic/angular";
import { ProductsDataService } from "../../providers/StoreData/products-data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { PhotoViewComponent } from "../../shared/photo-view/photo-view.component";
import { FormControl } from "@angular/forms";
import { debounceTime, map, startWith, tap } from "rxjs/operators";
import { EditProductPage } from "../edit-product/edit-product.page";

@Component({
  selector: "app-products-list",
  templateUrl: "./products-list.page.html",
  styleUrls: ["./products-list.page.scss"]
})
export class ProductsListPage implements OnInit {
  canSelect: any;
  products: Observable<Extended<Product>[]>;
  searchControl: FormControl;
  filteredProducts: Observable<Extended<Product>[]>;

  constructor(
    public router: Router,
    private rout: ActivatedRoute,
    @Optional() private navParams: NavParams,
    private alertController: AlertController,
    private modalController: ModalController,
    private productsRep: ProductsDataService
  ) {
    this.canSelect = false; // this.navParams.get("canSelect");
    const productsFsRepository = productsRep; // this.navParams.get("productsFsRepository");
    if (productsFsRepository) {
      this.productsRep = productsFsRepository;
    }
    this.products = this.productsRep.FormatedList;
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    // searchControl.valueChanges will not emit values untill the user make input
    // combineLatest will not emit values untill both ovseravables emit values
    console.log("ionViewDidLoad : ProductsListPage");
    const initializedValueChanges = this.searchControl.valueChanges.pipe(
      debounceTime(700),
      map(v => (v + "").trim()),
      startWith(""),
    //  tap(console.log)
    );
    // initializedValueChanges.subscribe(console.log);

    this.filteredProducts = combineLatest(
      initializedValueChanges,
      this.products
    ).pipe(
      map(([searcTerm, extProducts]) => {
        if (!searcTerm || !searcTerm.length) {
          return extProducts;
        }
        return extProducts.filter(extAccount => {
          return (
            extAccount.data.name
              .toUpperCase()
              .includes(searcTerm.toUpperCase()) ||
            extAccount.data.style
              .toUpperCase()
              .includes(searcTerm.toUpperCase())
          );
        });
      })
    );
  }

  async delete(extProduct: Extended<Product>) {
    const modal = await this.alertController.create({
      message: `Are you sure deleting product: ${extProduct.data.name}`,
      header: `Deleteing Product`,
      buttons: [
        {
          text: "Delete",
          handler: () => {
            this.productsRep.remove(extProduct);
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
  }
  onProductClicked(product?: Extended<Product>) {
    if (product && this.canSelect) {
      this.modalController.dismiss(product);
    }
  }
  cancel(product?: Extended<Product>) {
    this.modalController.dismiss();
  }


  async showProductImage(productSnapshot: Extended<Product>) {
    if (productSnapshot.ext.imageFile) {
      const modal = await this.modalController.create({
        component: PhotoViewComponent,
        componentProps: {
          canDelete: false,
          canSelect: false,
          images: [productSnapshot.data.thumbUrl]
        }
      });
      return modal.present();
    }
  }
  async showEditProduct(id) {
    const modal = await this.modalController.create({
      component: EditProductPage,
      componentProps: {
        id
      }, cssClass: "edit-modal"
    });
    return modal.present();
}
async showNewProduct() {
  return this.showEditProduct("new");
}

  async onDelete(productSnapshot: Extended<Product>) {
    const alert = await this.alertController.create({
      message: `Are u sure. deleting ${productSnapshot.data.name} Product`,
      header: "Deleting Product",
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.productsRep.remove(productSnapshot);
          }
        },
        {
          text: "Cancel"
        }
      ]
    });
    alert.present();
  }


  ngOnInit() {
    if (this.navParams) {
      this.canSelect = this.navParams.get("canSelect");
    }
    this.ionViewDidLoad();

  }
}
