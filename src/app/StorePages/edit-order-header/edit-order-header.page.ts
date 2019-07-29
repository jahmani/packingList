import { Component, OnInit, OnChanges, OnDestroy, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, of, Subscription } from "rxjs";
import { map, take, tap, switchMap, first } from "rxjs/operators";
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
import { EditOrderRowPage } from "../edit-order-row/edit-order-row.page";
import { ModalController } from "@ionic/angular";
import { OrderRowEditorComponent } from "../../shared/order-row-editor/order-row-editor.component";

@Component({
  selector: "app-edit-order-header",
  templateUrl: "./edit-order-header.page.html",
  styleUrls: ["./edit-order-header.page.scss"]
})
export class EditOrderHeaderPage implements OnInit, OnDestroy {
  packinglists: Observable<Extended<PackinglistInfo>[]>;

  // orderId$: Observable<string>;
  submitAttempt: boolean;
  orderId: string;
  order$: Observable<Extended<Order>>;
  form: FormGroup;
  sub: Subscription;
  newRowCtrol: FormControl;
  order: Extended<Order>;
  @ViewChild('newRowComponent', {static: false}) newRowComponent: OrderRowEditorComponent;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private ordersFsRep: OrdersDataService,
    private location: Location,
    private router: Router,
    private plInfoDataService: PackinglistInfoDataService,
    private modalCtrl: ModalController
  ) {
    this.form = this.fb.group({
      date: "",
      deliveryDate: "",
      notice: "",
      imageUrl: "",
      accountId: "",
      ammount: "",
      deposit: "",
      cbm: "",
      packingListId: "",
      rows: this.fb.array([])
    });
    /*
    this.orderId$ = this.route.paramMap.pipe(
      map(value => {
        return value.get("id");
      })
    );
    */
    this.packinglists = this.plInfoDataService.list;

    this.order$ = this.route.paramMap.pipe(
      switchMap(paramMap => {
        const orderId = paramMap.get("id");
        const packingListId = paramMap.get("plId");
        const accountId = paramMap.get("accountId");
        if (orderId === "new") {
          const newOrder: Order = {
            date: new Date().toISOString(),
            deliveryDate: new Date().toISOString(),
            packingListId,
            accountId
          } as Order;
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
        this.order = order;
        this.form.patchValue({ ...order.data, rows: [] });
        this.patchOrderRows(order.ext.extRows);
        this.newRowCtrol = this.fb.control(null);
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

  addNewOrderRow(copy?: Extended<OrderRow2>) {
    const newOrderRow: Extended<OrderRow2> = copy || {
      data: { sequence: 0 },
      ext: { state: "EMPTY" }
    } as Extended<OrderRow2>;
    this.newRowCtrol = this.fb.control(newOrderRow);

    this.newRowCtrol.patchValue(newOrderRow);
    this.newRowComponent.showEditOrderRowModal(newOrderRow);

    this.newRowCtrol.valueChanges
      .pipe(first())
      .subscribe((value: Extended<OrderRow2>) => {
        if (value.ext.state === "NEW") {
          value.ext.state = "ADDED";
          this.newRowCtrol.patchValue(value);
          this.orderRowsCtrl.push(this.newRowCtrol);
        }
      });
  }

  get ammountCtrl() {
    return this.form.get("ammount");
  }


  showNewOrderRow() {
    this.addNewOrderRow();
    // const newOrderRow: Extended<OrderRow2> = {
    //   data: { sequence: 0 },
    //   ext: { state: "EMPTY" }
    // } as Extended<OrderRow2>;
    // return this.presentEditOrderRowModal(newOrderRow);
  }

  showCopyOrderRow(orderRow: Extended<OrderRow2>) {
    const copyOrderRow = { ...orderRow };
    copyOrderRow.data = { ...copyOrderRow.data };
    copyOrderRow.ext = { ...copyOrderRow.ext, state: "NEW" };
    return this.addNewOrderRow(copyOrderRow);
  }

  dismiss(data: Extended<Order>, isDelete = false) {
    if (data.data.packingListId && isDelete) {
      this.router.navigate(["/StoreBase/Packinglist", data.data.packingListId]);
    } else {
      this.location.back();
    }
    /*
    if (data.id) {
      this.router.navigate(["/StoreBase/OrderView", data.id], {
        replaceUrl: true
      });
    }
    if (this.sub) {
      this.sub.unsubscribe();
    }
    */
  }
  onCancel() {
    return this.dismiss(this.order);
  }
  onSubmit({ value, valid }: { value: Order; valid: boolean }) {
    console.log(value, valid);
    this.submitAttempt = true;
    if (valid) {
      this.onSave(value);
    }
    // throw "please take care , invalid form"
  }

  async onSave(order: Order) {
    const extOrder = { data: order } as Extended<Order>;

    order.rows = order.rows.map(curr => {
      return ((curr as any) as Extended<OrderRow2>).data;
    }, {});
    if (this.orderId) {
      extOrder.id = this.orderId;
      this.ordersFsRep.saveOld(extOrder);
    } else {
      const newId = await this.ordersFsRep.newKey();
      extOrder.id = newId;
      this.ordersFsRep.saveNew(extOrder, newId);
    }
    this.dismiss(extOrder);
  }
  delete() {
    if (this.order.id) {
      this.ordersFsRep.remove(this.order);
    }
    this.dismiss(this.order, true);
  }
  ngOnInit(): void {
    // throw new Error("Method not implemented.");
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
