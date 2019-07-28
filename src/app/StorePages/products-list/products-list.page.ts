import { Component, OnInit, Optional, ViewChild } from "@angular/core";
import { Observable, combineLatest } from "rxjs";
import { Extended, Product, UserStore } from "../../interfaces/data-models";
import { NavParams, AlertController, ModalController, IonItemSliding, IonList, PopoverController } from "@ionic/angular";
import { ProductsDataService } from "../../providers/StoreData/products-data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormControl } from "@angular/forms";
import { debounceTime, map, startWith, tap } from "rxjs/operators";
import { EditProductPage } from "../edit-product/edit-product.page";
import { ProductsPageSettingsComponent } from "../../products-page-settings/products-page-settings.component";
import { StoreInfoService } from "../../providers/AppData/store-info.service";
import { ActiveStoreService } from "../../providers/AppData/active-store.service";

type ViewType = "LIST" | "CARDS" | "SLIDES" | "GRID";


@Component({
  selector: "app-products-list",
  templateUrl: "./products-list.page.html",
  styleUrls: ["./products-list.page.scss"]
})
export class ProductsListPage implements OnInit {
  userStore: Observable<Extended<UserStore>>;
  get dynamicList(): IonList {
    return this.dynamicList1 ? this.dynamicList1 : this.dynamicList2;
  }
  constructor(
    public router: Router,
    private rout: ActivatedRoute,
    @Optional() private navParams: NavParams,
    private alertController: AlertController,
    private modalController: ModalController,
    private productsRep: ProductsDataService,
    private storesInfo: StoreInfoService,
    private popoverCtrl: PopoverController,
    private ass: ActiveStoreService
  ) {
    this.canSelect = false; // this.navParams.get("canSelect");
    const productsFsRepository = productsRep; // this.navParams.get("productsFsRepository");
    if (productsFsRepository) {
      this.productsRep = productsFsRepository;
    }
  //  this.products = this.productsRep.FormatedList;
  this.userStore = this.ass.getActiveStoreInfo();
    this.products = this.productsRep.list;
    this.searchControl = new FormControl();
  }
  canSelect: any;
  products: Observable<Extended<Product>[]>;
  searchControl: FormControl;
  showSlideDetails = true;
  filteredProducts: Observable<Extended<Product>[]>;
  view: ViewType = "GRID";
  toggleView: ViewType;
  iconMap: { [id in ViewType]: string } = {
    "CARDS": '/assets/svg/thumbnails.svg',
    "GRID": '/assets/svg/list.svg',
    "LIST": '/assets/svg/card-thumbs.svg',
    "SLIDES": '/assets/svg/_ionicons_svg_md-arrow-forward.svg'
  };
  showSerach = false;
  @ViewChild('slidingItem1') dynamicList1: IonList;
  @ViewChild('slidingItem2') dynamicList2: IonList;


  slideIndex = 0;

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
    if (this.dynamicList) {
      await this.dynamicList.closeSlidingItems();
    }

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
  onProductClicked(product?: Extended<Product>, i?) {
    if (product && this.canSelect) {
      this.modalController.dismiss(product);
    } else if (product && i !== undefined) {
      this.toggleView = this.view;
      this.view = "SLIDES";
      this.slideIndex = i;
    }
  }
  cancel(product?: Extended<Product>) {
    this.modalController.dismiss();
  }
  backView() {
    this.view = this.toggleView;
    this.toggleView = undefined;
  }
  switchView() {
    if (this.dynamicList) {
      this.dynamicList.closeSlidingItems();
    }
    // this.view = this.view === 'LIST' ? 'CARDS' : 'LIST';
    switch (this.view) {
      case "LIST":
        this.view = "CARDS";
        this.toggleView = "CARDS";
        break;
      case "CARDS":
        this.view = "GRID";
        this.toggleView = "GRID";
        break;
      case "SLIDES":
        this.view = this.toggleView;
        break;
      case "GRID":
        this.view = "LIST";
        this.toggleView = "LIST";
        break;
      default:
        break;
    }
  }
  toggleSearch() {
    if (this.searchControl) {
      this.searchControl.setValue("");
    }
    this.showSerach = !this.showSerach;
  }
  async presentPopover(ev) {
    const popover = await this.popoverCtrl.create({
      component: ProductsPageSettingsComponent,
      // dynamic data to display
      componentProps: { productsPage: this },
      event: ev,

      // class to force positioning
      cssClass: 'my-class'
    });
    return await popover.present();
  }

  // onImageClicked(event, productSnapshot: Extended<Product>) {
  //   event.stopPropagation();
  //   if (productSnapshot.data.thumbUrl) {
  //     this.imageDataService
  //       .getByUrl(productSnapshot.data.thumbUrl)
  //       .then(extImage => {
  //         this.openPhoto(0, [extImage]);
  //       });
  //   }

  // }
  // async openPhoto(index, images) {
  //   const modal = await this.modalController.create({
  //     component: PhotoViewComponent, componentProps: {
  //       photo_index: index,
  //       canSelect: false,
  //       images
  //     }
  //   });
  //   modal.present();
  // }


  // async showProductImage(productSnapshot: Extended<Product>) {
  //   if (productSnapshot.ext.imageFile) {
  //     const modal = await this.modalController.create({
  //       component: PhotoViewComponent,
  //       componentProps: {
  //         canDelete: false,
  //         canSelect: false,
  //         images: [productSnapshot.data.thumbUrl]
  //       }
  //     });
  //     return modal.present();
  //   }
  // }

  async showEditProduct(id, slidingItem?: IonItemSliding) {
    if (slidingItem) {
      await slidingItem.close();
    }
    this.presentEditProduct(id);
  }
  async presentEditProduct(id, copy?) {
    if (this.dynamicList) {
      await this.dynamicList.closeSlidingItems();
    }
    const modal = await this.modalController.create({
      component: EditProductPage,
      componentProps: {
        id,
        copy
      }, cssClass: "edit-modal"
    });
    modal.present();
    return modal.onDidDismiss();
  }
  async showNewProduct() {
    return this.presentEditProduct("new").then(data => {
      if (data) {
        this.slideIndex = 0;
      }
    });
  }
  async showCopyProduct(product: Extended<Product>) {

    return this.presentEditProduct("new", product.data);
  }
  trackByFn(index, product: Extended<Product>) {
    if (product) {
      return product.id;
    }
  }
  ngOnInit() {
    if (this.navParams) {
      this.canSelect = this.navParams.get("canSelect");
    }
    this.ionViewDidLoad();

  }
}

