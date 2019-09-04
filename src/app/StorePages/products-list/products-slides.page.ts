import { Component, OnInit, Optional, ViewChild, AfterViewInit } from "@angular/core";
import { Observable, combineLatest } from "rxjs";
import { Extended, Product, UserStore, StoreInfo } from "../../interfaces/data-models";
import { NavParams, AlertController, ModalController, IonItemSliding, IonList, PopoverController, IonSlides } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { EditProductPage } from "../edit-product/edit-product.page";
import { ActiveStoreService } from "../../providers/AppData/active-store.service";
import { ProductsListDataService } from "./products-list-data.service";
import { map, flatMap, startWith } from "rxjs/operators";


@Component({
  selector: "app-products-slides",
  templateUrl: "./products-slides.page.html",
  styleUrls: ["./products-list.page.scss"]
})
export class ProductsSlidesPage implements AfterViewInit {

  userStore: Observable<Extended<StoreInfo>>;
  filteredProducts: Observable<Extended<Product>[]>;
  showSlideDetails = true;
  slideIndex = 0;
  @ViewChild(IonSlides, {static: false}) slides: IonSlides;
  activeSlideIndex: Observable<number>;

  constructor(
    private  router: Router,
    private modalController: ModalController,
    private prodList: ProductsListDataService,
    private ass: ActiveStoreService
  ) {
  this.userStore = this.ass.activeStoreInfo;
  this.filteredProducts = this.prodList.filteredProducts;
  this.slideIndex = this.prodList.slideIndex;

  }
  ngAfterViewInit(): void {
    console.log('slides', this.slides);
    this.activeSlideIndex = this.slides.ionSlideDidChange.pipe(flatMap(ev => {
     // console.log('ev : ', ev);
      return this.slides.getActiveIndex();
      // console.log()
    })).pipe(startWith(this.slideIndex)); }

  // ngOnInit(): void {

  // }
  async showEditProduct(id, slidingItem?: IonItemSliding) {
    if (slidingItem) {
      await slidingItem.close();
    }
    this.presentEditProduct(id);
  }
  async presentEditProduct(id, copy?) {

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
}

