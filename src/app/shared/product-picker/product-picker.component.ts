import { Component, OnInit, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { Extended, Product } from "../../interfaces/data-models";
import { ModalController, NavController } from "@ionic/angular";
import { ProductsDataService } from "../../providers/StoreData/products-data.service";
import { ProductsListPage } from "../../StorePages/products-list/products-list.page";

@Component({
  selector: "app-product-picker",
  templateUrl: "./product-picker.component.html",
  styleUrls: ["./product-picker.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProductPickerComponent),
      multi: true
    }
  ]
})
export class ProductPickerComponent implements OnInit {
  srcChangeFunction: any;
  productId: string;
  product: Extended<Product>;

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private productsFsRepository: ProductsDataService
  ) {
    console.log("Hello ProductSelectComponent Component");
  }
  writeValue(productId: string): void {
    this.productId = productId;
    if (this.productId) {
      this.productsFsRepository.getOnce(this.productId).then(extProduct => {
        this.product = extProduct;
      });
    }
  }
  removeProduct($event) {
    this.product = null;
    this.productId = null;
    this.srcChangeFunction(this.productId);
  }
 async selectProduct($event) {
    const self = this;

    // callback...
    // const myCallbackFunction = function(extProduct) {
    //   return new Promise((resolve, reject) => {
    //     if (extProduct) {
    //       self.product = extProduct;
    //       self.productId = extProduct.id;
    //       self.srcChangeFunction(extProduct.id);
    //     }
    //     resolve();
    //   });
    // };

    // push page...
    /*
    this.navCtrl.push("ProductsListPage", {
      callback: myCallbackFunction,
      productsFsRepository: this.productsFsRepository,
      canSelect: true,
      canGoBack: true
    });
    */
    /**/
    const modal = await this.modalCtrl.create({component : ProductsListPage, componentProps: {
      productsFsRepository: this.productsFsRepository,
      canSelect: true,
      canGoBack: true
    }});

    modal.present();
    modal.onDidDismiss().then((result: {[s: string]: Extended<Product>}) => {
      if (result && result.data) {
        const extProduct = result.data;
        this.product = extProduct;
        this.productId = extProduct.id;
        this.srcChangeFunction(extProduct.id);
      }
    });
  }
  registerOnChange(fn: any): void {
    this.srcChangeFunction = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
  ngOnInit() {}
}
