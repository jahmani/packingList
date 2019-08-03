import { Component, OnInit, Input, Output, AfterViewInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Extended, Product, StoreInfo } from '../../interfaces/data-models';

export interface ProductViewOptions {
  editable: boolean;
  view: "CARD" | "ITEM" | "THUMBNAIL" | "THUMB";
  showPrice: boolean;
  showNotes: boolean;
  photoOnly: boolean;
}
@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements AfterViewInit {
  static default: ProductViewOptions =  {editable: true, view: "ITEM", showPrice: true, showNotes: true, photoOnly: false} ;
  _options:  ProductViewOptions = ProductViewComponent.default;
  @ViewChild('fullImg', {static: false}) fullImg: any;
  @Input() product: Extended<Product>;
  @Input() storeInfo: Extended<StoreInfo>;
  @Input() set options(val) {
    this._options = {...ProductViewComponent.default, ...val};
  }
  get options() {
    return this._options;
  }

  @Output() edit = new EventEmitter();
  @Output() copy = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() prodClick = new EventEmitter();
  @Output() imgClick = new EventEmitter();
  constructor() { }

  ngAfterViewInit() {

  }
  onIonImgDidLoad() {
    if (this.product.data.thumbUrl) {
      this.product.ext.imageFile.ext.loaded = true;
    }

  }
}
