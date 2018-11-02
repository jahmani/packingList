import { Component, OnInit, OnChanges } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { map, take, tap, switchMap } from "rxjs/operators";
import { FormBuilder, FormGroup } from "@angular/forms";
import { OrdersDataService } from "../../providers/StoreData/orders-data.service";
import { Extended, Order, PLLine } from "../../interfaces/data-models";
import { Location } from "@angular/common";

@Component({
  selector: "app-edit-order-header",
  templateUrl: "./edit-order-header.page.html",
  styleUrls: ["./edit-order-header.page.scss"]
})
export class EditOrderHeaderPage implements OnInit {
  orderId$: Observable<string>;
  submitAttempt: boolean;
  orderId: string;
  order$: Observable<Extended<Order>>;
  form: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private ordersFsRep: OrdersDataService,
    private location: Location,
    private router: Router
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

    this.orderId$ = this.route.paramMap.pipe(
      map(value => {
        return value.get("id");
      })
    );

    this.order$ = this.orderId$.pipe(
      switchMap(orderId => {
        if (orderId === "new") {
          const newOrder: Order = {} as Order;
          return of({ data: newOrder, id: null } as Extended<Order>);
        } else {
          return this.ordersFsRep.getExtended(orderId);
        }
      }),
      tap(order => {
        this.orderId = order.id;
        this.form.patchValue(order.data);
      })
    );
  }
  get ammountCtrl() {
    return this.form.get("ammount");
  }

  presentCopyPlLine(plLine: Extended<PLLine>) {
    const plLineData = plLine.data;
    //  this.navCtrl.push("EditPlLinePage", { plLineData });
  }

  dismiss(data: Extended<Order>) {
    if (this.orderId || !data) {
      return this.location.back();
    } else {
      this.router.navigate(["/StoreBase/OrderView", data.id], { replaceUrl: true });
    }
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
    if (this.orderId) {
      extOrder.id = this.orderId;
      this.ordersFsRep.saveOld(extOrder);
    } else {
      const newId = this.ordersFsRep.newKey();
      extOrder.id = newId;
      this.ordersFsRep.saveNew(extOrder, newId);
    }
    this.dismiss(extOrder);
  }
  ngOnInit(): void {
    // throw new Error("Method not implemented.");
  }
}
