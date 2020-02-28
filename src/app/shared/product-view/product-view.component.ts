import { Component, OnInit, Input, Output, AfterViewInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Extended, Product, StoreInfo } from '../../interfaces/data-models';
import { ActiveStoreService } from '../../providers/AppData/active-store.service';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { EditProductPage } from '../../StorePages/edit-product/edit-product.page';
import { Router, ActivatedRoute } from '@angular/router';

export interface ProductViewOptions {
  editable: boolean;
  view: "CARD" | "ITEM" | "THUMBNAIL" | "THUMB";
  showPrice: boolean;
  showNotes: boolean;
  photoOnly: boolean;
  showSlideDetails: boolean;
}
@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements AfterViewInit {
  static default: ProductViewOptions = {
    editable: true, view: "ITEM", showPrice: true,
    showNotes: true, photoOnly: false, showSlideDetails: true
  };
  _options: ProductViewOptions = ProductViewComponent.default;
  _expanded = false;
  @ViewChild('fullImg', { static: false }) fullImg: any;
  @Input() product: Extended<Product>;
  storeInfo: Extended<StoreInfo>;
  // @Input() storeInfo: Extended<StoreInfo>;
  @Input() set options(val) {
    this._options = { ...ProductViewComponent.default, ...val };
  }
  get options() {
    return this._options;
  }
  @ViewChild('slidingItem', { static: false }) slidingItem: IonItemSliding;
  @Output() edit = new EventEmitter();
  @Output() copy = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() prodClick = new EventEmitter();
  @Output() imgClick = new EventEmitter();
  constructor(
    private ass: ActiveStoreService,
    private modalControler: ModalController,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.storeInfo = ass.activeStoreInfoValue;
  }

  ngAfterViewInit() {

  }
  onIonImgDidLoad() {
    if (this.product.data.thumbUrl) {
      this.product.ext.imageFile.ext.loaded = true;
    }

  }
  async presentCopyProduct(copy: Extended<Product>) {
    if (this.slidingItem) {
      await this.slidingItem.close();
    }
    copy = { ...copy, id: null, data: { ...copy.data, name: 'copy - ' + copy.data.name } };
    return this.presentEditProduct('new', copy);
  }
  async presentEditProduct(id, copy?) {

    this.router.navigate([], {
      relativeTo: this.activatedRoute, queryParams: {
        editProductModal: JSON.stringify({id, copy})
      },
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      skipLocationChange: false
    });

    // return await this.presentEditProductModal(id, copy);
  }
  async presentEditProduct2(id, copy?: Extended<Product>) {
    if (this.slidingItem) {
      await this.slidingItem.closeOpened();
    }
    const modal = await this.modalControler.create({
      component: EditProductPage,
      componentProps: {
        id,
        copy
      }, cssClass: "edit-modal"
    });
    modal.present();
    return modal.onDidDismiss();
  }

}
