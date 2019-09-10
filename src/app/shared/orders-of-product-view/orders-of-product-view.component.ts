import { Component, OnInit, Input } from '@angular/core';
import { OrdersDataService } from '../../providers/StoreData/orders-data.service';
import { Extended, Product, Order, StoreInfo } from '../../interfaces/data-models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActiveStoreService } from '../../providers/AppData/active-store.service';

@Component({
  selector: 'app-orders-of-product-view',
  templateUrl: './orders-of-product-view.component.html',
  styleUrls: ['./orders-of-product-view.component.scss']
})
export class OrdersOfProductViewComponent implements OnInit {

  productId: string;
  storeInfo: Extended<StoreInfo>;
  @Input() set product(val: Extended<Product>) {
    this.productId = val.id;
    this.orders = this.ordersDataService.forProduct(val.id).pipe(map(orders => {
      return orders.map(order => {
        order.ext.rowsOfProduct = {... order.ext.rowsOfProduct};
        order.ext.rowsOfProduct[this.productId] = order.ext.extRows.filter(row => row.data.productId === this.productId);
        order.ext.rowsOfProduct[this.productId].map(row => {
          row.ext.ctns = row.data.packingLines.reduce((prev, curr) => prev + curr.ctns, 0);
          return row;
        });
        return order;
      }
      );
    }));
  }
  orders: Observable<Extended<Order>[]>;

  constructor(
    private ordersDataService: OrdersDataService,
    private ass: ActiveStoreService

  ) {
    this.storeInfo = ass.activeStoreInfoValue;
  }
  ngOnChange() {
  }
  ngOnInit(
  ) {

  }

}
