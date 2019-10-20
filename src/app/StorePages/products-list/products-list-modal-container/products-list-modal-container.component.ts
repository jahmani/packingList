import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ProductsListPage } from '../products-list.page';
import { Extended, Product } from '../../../interfaces/data-models';
import { ProductsDataService } from '../../../providers/StoreData/products-data.service';

@Component({
  selector: 'app-products-list-modal-container',
  templateUrl: './products-list-modal-container.component.html',
  styleUrls: ['./products-list-modal-container.component.scss']
})
export class ProductsListModalContainerComponent implements OnInit {

  constructor(
    route: ActivatedRoute,
    router: Router,
    private modalCtrl: ModalController,
    private productsFsRepository: ProductsDataService
  ) { }

  ngOnInit() {
  }
  async selectProduct($event) {
    const self = this;
    const modal = await this.modalCtrl.create({component : ProductsListPage, componentProps: {
      productsFsRepository: this.productsFsRepository,
      canSelect: true,
      canGoBack: true
    }});

    modal.present();
    modal.onDidDismiss().then((result: {[s: string]: Extended<Product>}) => {
      if (result && result.data) {
        const extProduct = result.data;
      //  this.product = extProduct;
      //  this.productId = extProduct.id;
      }
    });
  }
}
