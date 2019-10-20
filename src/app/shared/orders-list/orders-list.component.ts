import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  totals: { qty: number; ammount: number; cbm: number, productName: string };
  activeLineIndex: number;
  activreStoreInfo: Observable<Extended<StoreInfo>>;
  @Input() forProductId: string;
  reorderGroupEnabled;
  @Input("orders")
  set _orders(val: Extended<Order>[]) {
    this.orders = val;
    if (this.orders && this.manualOrder) {
      this.orders.sort((a, b) => this.manualOrder.indexOf(a.id) - this.manualOrder.indexOf(b.id));
    }

    if (val) { this.computeTotal(); }
    console.log("linnnnes: ", val);
  }

  @Input("manualOrder")
  set _manualOrder(val: string[]) {
    this.manualOrder = val;
    if (val && val.length) {
      this.manualOrder = [...val];
      if (this.orders) {
        this.orders.sort((a, b) => this.manualOrder.indexOf(a.id) - this.manualOrder.indexOf(b.id));
      }
    }

    console.log("manualOrder: ", val);
  }
  manualOrder: string[];
  @Input() showListHeader: boolean;
  @Output() ReorderFinish = new EventEmitter<string[]>();


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
  doReorder(ev: any) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    this.manualOrder.splice(ev.detail.to, 0, this.manualOrder.splice(ev.detail.from, 1)[0]);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }

  toggleReorder() {
    if (this.reorderGroupEnabled) {
      this.finishReorder();
    } else {
      this.startReorder();
    }
  }

  startReorder() {
    this.reorderGroupEnabled = true;
    // if (!this.manualOrder) {
      this.manualOrder = this.orders.map(o => o.id);
    // }
  }
  finishReorder() {
    this.reorderGroupEnabled = false;
    this.ReorderFinish.emit(this.manualOrder);
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
      { qty: 0, ammount: 0, cbm: 0, productName: "Totals" }
    );
    this.totals = totalsLine;
  }
  ngOnInit() { }
}
