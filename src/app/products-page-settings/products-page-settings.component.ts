import { Component, OnInit, Input } from '@angular/core';
// import { ProductsListPage } from '../StorePages/products-list/products-list.page';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-products-page-settings',
  templateUrl: './products-page-settings.component.html',
  styleUrls: ['./products-page-settings.component.scss']
})
export class ProductsPageSettingsComponent implements OnInit {

  @Input() productsPage;
  constructor(
    private popoverController: PopoverController
  ) { }
  viewChanged(ev: CustomEvent) {
    console.log('Segment changed', ev.detail.value);
    this.productsPage.view = ev.detail.value;
    this.popoverController.dismiss();
  }
  showFilter() {
    console.log('showFilter changed');
    this.productsPage.showSearch = true;
    this.popoverController.dismiss();
  }
  ngOnInit() {
  }

}
