import { Component, OnInit } from '@angular/core';
import { ProductViewComponent } from '../product-view/product-view.component';

@Component({
  selector: 'app-product-line-view',
  templateUrl: './product-line-view.component.html',
  styleUrls: ['./product-line-view.component.scss']
})
export class ProductLineViewComponent extends ProductViewComponent {

  constructor() {
    super();
   }


}
