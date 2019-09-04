import { Component, OnInit, Input } from '@angular/core';
import { Order, Extended, StoreInfo } from '../../interfaces/data-models';
import { Router } from '@angular/router';
import { ActiveStoreService } from '../../providers/AppData/active-store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {
  orders: Extended<Order>[];
  totals: { qty: number; ammount: number; cbm: number,  productName: string };
  activeLineIndex: number;
  activreStoreInfo: Observable<Extended<StoreInfo>>;
  @Input("orders")
  set _orders(val: Extended<Order>[]) {
    this.orders = val;
    if (val) { this.computeTotal(); }
    console.log("linnnnes: ", val);
  }
  @Input() showListHeader: boolean;


  constructor(private router: Router, ass: ActiveStoreService) {
    this.activreStoreInfo = ass.activeStoreInfo;
    console.log("Hello OrderRowsListComponent Component");
  }

  onRowClicked(index: number) {
    return this.toggleActiveOrder(index);
  }
  toggleActiveOrder(index: number) {
    if (this.activeLineIndex === index) {
      this.activeLineIndex = undefined;
    } else {
      this.activeLineIndex = index;
    }
  }
  openOrder(id: string) {
    this.router.navigateByUrl(this.router.url + "/OrderView/" + id);
  }

  computeTotal() {

    const totalsLine = this.orders.reduce(
      (prev, curr, i, arr) => {
        const qty = curr.data.rows.reduce(((prev1, curr1) => prev1 + Number(curr1.qty)), 0);
        prev.qty += qty || 0;
        prev.ammount += Number(curr.data.ammount) || 0;
        prev.cbm += Number(curr.data.cbm) || 0;
        return prev;
      },
      { qty: 0, ammount: 0, cbm: 0,  productName: "Totals" }
    );
    this.totals = totalsLine;
  }
  ngOnInit() {}
}
