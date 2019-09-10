import { Component, OnInit, Optional, ViewChild } from "@angular/core";
import { Observable, combineLatest } from "rxjs";
import { Extended, Product, UserStore, StoreInfo } from "../../interfaces/data-models";
import { NavParams, AlertController, ModalController, IonItemSliding, IonList, PopoverController } from "@ionic/angular";
import { ProductsDataService } from "../../providers/StoreData/products-data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormControl } from "@angular/forms";
import { debounceTime, map, startWith, tap } from "rxjs/operators";
import { EditProductPage } from "../edit-product/edit-product.page";
import { ActiveStoreService } from "../../providers/AppData/active-store.service";
import { ProductsListDataService } from "./products-list-data.service";
import { PageActions, ViewType } from "../../shared/edit-options-popover/edit-options-popover.component";


@Component({
  selector: "app-products-list",
  templateUrl: "./products-list.page.html",
  styleUrls: ["./products-list.page.scss"]
})
export class ProductsListPage implements OnInit {
  ViewType = ViewType;
  userStore: Observable<Extended<StoreInfo>>;
  views = [ViewType.GRID, ViewType.LIST, ViewType.CARDS];
  actions = [PageActions.FILTER, PageActions.ADDNEW];
  get dynamicList(): IonList {
    return this.dynamicList1 ? this.dynamicList1 : this.dynamicList2;
  }
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    @Optional() private navParams: NavParams,
    private alertController: AlertController,
    private modalController: ModalController,
    private productsRep: ProductsDataService,
    private prodListServ: ProductsListDataService,
    private ass: ActiveStoreService
  ) {
    this.canSelect = false; // this.navParams.get("canSelect");
    const productsFsRepository = productsRep; // this.navParams.get("productsFsRepository");
    if (productsFsRepository) {
      this.productsRep = productsFsRepository;
    }
    //  this.products = this.productsRep.FormatedList;
    this.userStore = this.ass.activeStoreInfo;
    this.products = this.productsRep.List;
    this.searchControl = new FormControl();
  }
  canSelect: any;
  products: Observable<Extended<Product>[]>;
  searchControl: FormControl;
  showSlideDetails = true;
  filteredProducts: Observable<Extended<Product>[]>;
  view: ViewType = this.getView();

  showSearch = false;
  @ViewChild('slidingItem1', { static: false }) dynamicList1: IonList;
  @ViewChild('slidingItem2', { static: false }) dynamicList2: IonList;


  slideIndex = 0;

  ionViewDidLoad() {
    // searchControl.valueChanges will not emit values untill the user make input
    // combineLatest will not emit values untill both ovseravables emit values
    console.log("ionViewDidLoad : ProductsListPage");
    const initializedValueChanges = this.searchControl.valueChanges.pipe(
      debounceTime(700),
      map(v => (v + "").trim()),
      startWith(""),
    );

    this.filteredProducts = combineLatest([
      initializedValueChanges,
      this.products]
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
    this.prodListServ.filteredProducts = this.filteredProducts;
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
  getLineItemHeight(product?: Extended<Product>, i?) {
    if (product.data.notice) {
      return 141;
    } else {
      return 110;
    }
  }
  getCardItemHeight(product?: Extended<Product>, i?) {
    if (product.data.notice) {
      return 141;
    } else {
      return 110;
    }
  }
  onProductClicked(product?: Extended<Product>, i?) {
    if (product && this.canSelect) {
      this.modalController.dismiss(product);
    } else if (product && i !== undefined) {
      this.slideIndex = i;
      this.prodListServ.slideIndex = i;
      this.router.navigate(['slideView'], { relativeTo: this.activatedRoute });
    }
  }
  cancel(product?: Extended<Product>) {
    this.modalController.dismiss();
  }

  onAction(action) {
    switch (action) {
      case PageActions.FILTER:
        this.toggleSearch();
        break;
      case PageActions.ADDNEW:
        this.showNewProduct();
        break;
      default:
        break;
    }
  }
  toggleSearch() {
    if (this.searchControl) {
      this.searchControl.setValue("");
    }
    this.showSearch = !this.showSearch;
  }

  onViewChange(view) {
    this.setView(view);
  }
  private setView(view) {
    this.view = view;
    window.localStorage.setItem('product-view', view);
  }
  private getView() {
    const view = window.localStorage.getItem('product-view');
    return (view || ViewType.GRID) as ViewType;
  }

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

