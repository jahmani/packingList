import { Component, OnInit } from "@angular/core";
import {
  Extended,
  Order,
  OrderRow,
  OrderRow2
} from "../../interfaces/data-models";
import { Observable } from "rxjs";
import { FormBuilder } from "@angular/forms";
import { NavController, NavParams } from "@ionic/angular";
import { map, distinctUntilChanged, take, tap } from "rxjs/operators";
import { OrdersDataService } from "../../providers/StoreData/orders-data.service";
// import { OrderRowsService } from "../../providers/StoreData/order-rows.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-order-view",
  templateUrl: "./order-view.page.html",
  styleUrls: ["./order-view.page.scss"]
})
export class OrderViewPage implements OnInit {
  showEditButton = true;
  submitAttempt: boolean;
  order: Extended<Order>;
  order$: Observable<Extended<Order>>;
  orderPlLines$: Observable<Extended<OrderRow2>[]>;
  view = "LIST";
  orderId: string;
  constructor(
    private ordersFsRep: OrdersDataService,
    // private pLLinesFsRepository: OrderRowsService,
    public rout: ActivatedRoute
  ) {
    const oId = this.rout.snapshot.paramMap.get("id");
    if (oId) {
      this.initializeOrder(oId);
    }
  }
  initializeOrder(orderId) {
    this.orderId = orderId;
    this.order$ = this.ordersFsRep.getExtended(this.orderId);
    //  this.orderPlLines$ = this.pLLinesFsRepository.forOrder(this.orderId);
    this.orderPlLines$ = this.order$.pipe(
      map(order => {
        return order.ext.extRows;
      })
    );
  }

  ngOnInit() {}
}
