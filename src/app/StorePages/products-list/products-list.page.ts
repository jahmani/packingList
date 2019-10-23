import { Component, OnInit, Optional, ViewChild } from "@angular/core";
import { Observable, combineLatest, merge } from "rxjs";
import { Extended, Product, UserStore, StoreInfo, PackinglistInfo } from "../../interfaces/data-models";
import { NavParams, AlertController, ModalController, IonItemSliding, IonList, PopoverController } from "@ionic/angular";
import { ProductsDataService } from "../../providers/StoreData/products-data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormControl } from "@angular/forms";
import { debounceTime, map, startWith, tap, flatMap, shareReplay, filter } from "rxjs/operators";
import { EditProductPage } from "../edit-product/edit-product.page";
import { ActiveStoreService } from "../../providers/AppData/active-store.service";
import { ProductsListDataService } from "./products-list-data.service";
import { PageActions, ViewType } from "../../shared/edit-options-popover/edit-options-popover.component";
import { ActivePListService } from "../../providers/StoreData/active-plist.service";
import { SeoService } from "../../seo.service";
import { CanComponentDeactivate } from "../../providers/routGuards/can-deactivate.guard";


@Component({
  selector: "app-products-list",
  templateUrl: "./products-list.page.html",
  styleUrls: ["./products-list.page.scss"]
})
export class ProductsListPage implements OnInit, CanComponentDeactivate {
  ViewType = ViewType;
  userStore: Observable<Extended<StoreInfo>>;
  views = [ViewType.GRID, ViewType.LIST, ViewType.CARDS];
  actions = [PageActions.FILTER, PageActions.ADDNEW];
  activePList: Observable<Extended<PackinglistInfo>>;
  get dynamicList(): IonList {
    return this.dynamicList1 ? this.dynamicList1 : this.dynamicList2;
  }
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    @Optional() private navParams: NavParams,
    private modalController: ModalController,
    private productsRep: ProductsDataService,
    private prodListServ: ProductsListDataService,
    private ass: ActiveStoreService,
    private apls: ActivePListService,
    private seos: SeoService
  ) {
    this.canSelect = false; // this.navParams.get("canSelect");
    // const productsFsRepository = productsRep; // this.navParams.get("productsFsRepository");
    if (this.navParams) {
      this.products = this.productsRep.List;
    } else {
      this.products = this.apls.activePlistProducts;

    }

    this.userStore = this.ass.activeStoreInfo;
    // const allProducts = this.apls.activePlistId.pipe(filter((id, index) => !id), flatMap(() => this.productsRep.List));
    // this.products = merge(allProducts, this.apls.activePlistProducts ).pipe(shareReplay(1));
    this.searchControl = new FormControl();

    this.activePList = this.apls.activePlist;
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
  async canDeactivate(): Promise<boolean> {
    const topModal = await this.modalController.getTop();
    if (topModal) {
     // console.log(" A Modal is already opened , cant go back");
      topModal.dismiss();
      return false;
    }
    return true;
  }

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
  ionViewDidEnter() {
    this.seos.generateTags({ title: "Products List" });

  }
  ngOnInit() {
    if (this.navParams) {
      this.canSelect = this.navParams.get("canSelect");
    }
    this.ionViewDidLoad();


  }
}

