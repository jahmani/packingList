import { Component, OnInit } from "@angular/core";
import { Extended, Order, PLLine } from "../../interfaces/data-models";
import { Observable } from "rxjs";
import { FormBuilder } from "@angular/forms";
import { NavController, NavParams } from "@ionic/angular";
import { map, distinctUntilChanged, take } from "rxjs/operators";
import { OrdersDataService } from "../../providers/StoreData/orders-data.service";
import { OrderPackingLinesService } from "../../providers/StoreData/order-packing-lines.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-order-view",
  templateUrl: "./order-view.page.html",
  styleUrls: ["./order-view.page.scss"]
})
export class OrderViewPage implements OnInit {
  showEditButton = false;
  submitAttempt: boolean;
  order: Extended<Order>;
  order$: Observable<Extended<Order>>;
  orderPlLines$: Observable<Extended<PLLine>[]>;
  view = "LIST";
  orderId: string;
  constructor(
    private ordersFsRep: OrdersDataService,
    private pLLinesFsRepository: OrderPackingLinesService,
    public rout: ActivatedRoute
  ) {
    const oId = this.rout.snapshot.paramMap.get("id");

    if (oId) { this.initializeOrder(oId); } else {
      this.presentNewOrderHeader();
    }
  }
  initializeOrder(orderId) {
    this.orderId = orderId;
    this.order$ = this.ordersFsRep.getExtended(this.orderId);
    this.orderPlLines$ = this.pLLinesFsRepository.forOrder(this.orderId);
    const plLinesSum$ = this.orderPlLines$
      .pipe(
        map(plLines => {
          return plLines.reduce((prev, curr) => {
            return (prev += curr.data.ammount);
          }, 0);
        })
      )
      .pipe(distinctUntilChanged());
    plLinesSum$.subscribe(val => {});
    this.order$.pipe(take(1)).subscribe(extOrder => {
      this.order = extOrder;
    });
  }
  presentEditOrderHeader(orderId) {
   // this.navCtrl.push("OrderHeaderEditPage", { orderId });
  }
  presentNewOrderHeader() {
    const self = this;
    const callBack = (extOrder: Extended<Order>) => {
      return new Promise(resolve => {
        if (extOrder) {
          this.initializeOrder(extOrder.id);
        } else {
//           this.navCtrl.pop();
           }
        resolve();
      });
    };
//    this.navCtrl.push("OrderHeaderEditPage", { callBack });
  }
  presentEditPlLine(plLineId) {
//    this.navCtrl.push("EditPlLinePage", { plLineId });
  }
  presentCopyPlLine(plLine: Extended<PLLine>) {
    const plLineData = plLine.data;
  //  this.navCtrl.push("EditPlLinePage", { plLineData });
  }

  dismiss(data) {
 //   this.navCtrl.pop();
  }

  presentNewPLLineModal() {
    return this.presentEditPLLineModal();
  }

  presentEditPLLineModal(plLineId?: string) {
  //  this.navCtrl.push("EditPlLinePage", { plLineId, orderId: this.orderId });
  }
  ngOnInit() {}
}
