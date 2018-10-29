import { Component, OnInit, Optional } from "@angular/core";
import { Observable } from "rxjs";
import { Extended, Product } from "../../interfaces/data-models";
import { NavParams, AlertController, ModalController } from "@ionic/angular";
import { ProductsDataService } from "../../providers/StoreData/products-data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { PhotoViewComponent } from "../../shared/photo-view/photo-view.component";

@Component({
  selector: "app-products-list",
  templateUrl: "./products-list.page.html",
  styleUrls: ["./products-list.page.scss"]
})
export class ProductsListPage implements OnInit {
  canSelect: any;
  products: Observable<Extended<Product>[]>;

  constructor(
    public router: Router,
    private rout: ActivatedRoute,
    public navParams: NavParams,
    private alertController: AlertController,
    private modalController: ModalController,
    private productsRep: ProductsDataService,
  ) {
    this.canSelect = false; // this.navParams.get("canSelect");
    const productsFsRepository = productsRep; // this.navParams.get("productsFsRepository");
    if (productsFsRepository) { this.productsRep = productsFsRepository; }
    this.products = this.productsRep.FormatedList;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ProductsPage");
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
    this.canSelect = this.navParams.get("canSelect");
    if (product && this.canSelect) {
      this.modalController.dismiss(product);
      /*const callback = this.navParams.get("callback");

      callback(product).then(() => {
        this.modalController.dismiss();
      });
      */
    }
  }

  copyAndEdit(product?: Extended<Product>) {
    const copyProd = { data: { ...product.data } } as Extended<Product>;
    this.presentEditProductModal(copyProd);
  }
  presentEditProductModal(product?: Extended<Product>) {
   /* this.navCtrl.push("EditProductPage", {
      productId: product && product.id,
      productData: product && product.data,
      productsRep: this.productsRep
    });
    */
  }
  async showProductImage(productSnapshot: Extended<Product>) {
    if (productSnapshot.ext.imageFile) {
      const modal = await this.modalController.create({component : PhotoViewComponent , componentProps: {
        canDelete: false,
        canSelect: false,
        images: [productSnapshot.data.thumbUrl]
      }});
      return modal.present();
    }
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

  presentNewProductModal() {
    const date = new Date().toISOString();
    //    date = UTCToLocal(date)

    return this.presentEditProductModal();
  }
  ngOnInit() {}
}
