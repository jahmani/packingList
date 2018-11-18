import { Component, OnInit, OnChanges } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, of, Subscription } from "rxjs";
import { map, take, tap, switchMap } from "rxjs/operators";
import { FormBuilder, FormGroup, FormArray, FormControl } from "@angular/forms";
import { OrdersDataService } from "../../providers/StoreData/orders-data.service";
import {
  Extended,
  Order,
  OrderRow,
  PackinglistInfo,
  OrderRow2
} from "../../interfaces/data-models";
import { Location } from "@angular/common";
import { PackinglistInfoDataService } from "../../providers/StoreData/packinglist-info-data.service";

@Component({
  selector: "app-edit-order-header",
  templateUrl: "./edit-order-header.page.html",
  styleUrls: ["./edit-order-header.page.scss"]
})
export class EditOrderHeaderPage implements OnInit {
  packinglists: Observable<Extended<PackinglistInfo>[]>;

  orderId$: Observable<string>;
  submitAttempt: boolean;
  orderId: string;
  order$: Observable<Extended<Order>>;
  form: FormGroup;
  sub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private ordersFsRep: OrdersDataService,
    private location: Location,
    private router: Router,
    private plInfoDataService: PackinglistInfoDataService
  ) {
    //    this.orderId = this.navParams.get("orderId");
    this.form = this.fb.group({
      date: "",
      deliveryDate: "",
      notice: "",
      imageUrl: "",
      accountId: "",
      ammount: {value: "", disabled: true},
      cbm: "",
      packingListId: "",
      rows: this.fb.array([])
    });

    this.orderId$ = this.route.paramMap.pipe(
      map(value => {
        return value.get("id");
      })
    );
    this.packinglists = this.plInfoDataService.List();

    this.order$ = this.orderId$.pipe(
      switchMap(orderId => {
        if (orderId === "new") {
          const newOrder: Order = {} as Order;
          return of({
            data: newOrder,
            id: null,
            ext: { extRows: [] }
          } as Extended<Order>);
        } else {
          return this.ordersFsRep.getExtended(orderId);
        }
      }),
      take(1),
      tap(order => {
        this.orderId = order.id;
        this.form.patchValue({ ...order.data, rows: [] });
        this.patchOrderRows(order.ext.extRows);
      })
    );
    this.sub = this.orderRowsCtrl.valueChanges.subscribe(
      (rows: Extended<OrderRow2>[]) => {
        const total = rows.reduce<{ ammount: number }>(
          (prev, curr) => {
            prev.ammount += curr.data.ammount;
            return prev;
          },
          { ammount: 0 }
        );
        this.ammountCtrl.setValue(total.ammount);
      }
    );
  }
  get orderRowsCtrl() {
    return this.form.get("rows") as FormArray;
  }
  removeOrderRow(index: number) {
    this.orderRowsCtrl.removeAt(index);
  }
  patchOrderRows(orderRows: Extended<OrderRow2>[]) {
    if (!orderRows) {
      return;
    }
    this.orderRowsCtrl.setValue([]);
    orderRows.forEach(orderRow => {
      const fc = this.fb.control(orderRow);
      this.orderRowsCtrl.push(fc);
      fc.patchValue(orderRow);
    });
  }

  get ammountCtrl() {
    return this.form.get("ammount");
  }

  presentCopyPlLine(plLine: Extended<OrderRow>) {
    const plLineData = plLine.data;
    //  this.navCtrl.push("EditPlLinePage", { plLineData });
  }

  dismiss(data: Extended<Order>) {
    if (this.orderId || !data) {
      return this.location.back();
    } else {
      this.router.navigate(["/StoreBase/OrderView", data.id], {
        replaceUrl: true
      });
    }
    if (this.sub) {
      this.sub.unsubscribe();
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

    order.rows = order.rows.map(curr => {
      return ((curr as any) as Extended<OrderRow2>).data;
    }, {});
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
