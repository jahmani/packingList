import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { Extended, Order, OrderRow } from "../../interfaces/data-models";
import { Observable, of } from "rxjs";
import { FormGroup, FormBuilder } from "@angular/forms";
import { NavController, NavParams } from "@ionic/angular";
import { map, distinctUntilChanged, take, tap } from "rxjs/operators";
import { OrdersDataService } from "../../providers/StoreData/orders-data.service";
import { OrderRowsService } from "../../providers/StoreData/order-rows.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-order-header-edit",
  templateUrl: "./order-header-edit.component.html",
  styleUrls: ["./order-header-edit.component.scss"]
})
export class OrderHeaderEditComponent implements OnInit, OnChanges {
  submitAttempt: boolean;
  order: Extended<Order>;
  order$: Observable<Extended<Order>>;
  view = "LIST";
  callBack;
  form: FormGroup;
  @Input()
  orderId: string;
  constructor(
    private fb: FormBuilder,
    private ordersFsRep: OrdersDataService,
    private location: Location
  ) {
    //    this.orderId = this.navParams.get("orderId");
    this.form = this.fb.group({
      date: "",
      deliveryDate: "",
      notice: "",
      imageUrl: "",
      accountId: "",
      ammount: "",
      cbm: ""
    });
  }
  get ammountCtrl() {
    return this.form.get("ammount");
  }
  presentEditPlLine(plLineId) {
    //  this.navCtrl.push("EditPlLinePage", { plLineId });
  }
  presentCopyPlLine(plLine: Extended<OrderRow>) {
    const plLineData = plLine.data;
    //  this.navCtrl.push("EditPlLinePage", { plLineData });
  }
  ionViewDidEnter() {}

  ionViewDidLoad() {
    //// this.form.patchValue(this.order)
  }

  dismiss(data) {
    return this.location.back();
    /*
    this.callBack = this.navParams.get("callBack");
    if (this.callBack) {
      this.callBack(data).then(() => {
 //       this.navCtrl.pop();
      });
    } else {
  //    this.navCtrl.pop();
    }
    */
  }
  onCancel() {
    return this.dismiss(null);
  }
  onSubmit({ value, valid }: { value: Order; valid: boolean }) {
    console.log(value, valid);
    this.submitAttempt = true;
    if (valid) {
      this.onSave(value);
    }
    // throw "please take care , invalid form"
  }



  onSave(order: Order) {
    const extOrder = { data: order } as Extended<Order>;
    if (this.order.id) {
      extOrder.id = this.order.id;
      this.ordersFsRep.saveOld(extOrder);
    } else {
      const newId = this.ordersFsRep.newKey();
      extOrder.id = newId;
      this.ordersFsRep.saveNew(extOrder, newId);
    }

    this.dismiss(extOrder);
  }

  ngOnInit() {}
  ngOnChanges(): void {
    if (this.orderId) {
      this.order$ = this.ordersFsRep.getExtended(this.orderId);
      /*
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
      plLinesSum$.subscribe(val => {
        if (val !== this.ammountCtrl.value) { this.ammountCtrl.patchValue(val); }
      });
      */
    } else {
      const newOrder: Order = {} as Order;
      this.order$ = of({ data: newOrder, id: null } as Extended<Order>);
    }
    this.order$ = this.order$.pipe(
      take(1),
      tap(extOrder => {
        this.order = extOrder;
        this.form.patchValue(this.order.data);
      })
    );
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.
  }
}
