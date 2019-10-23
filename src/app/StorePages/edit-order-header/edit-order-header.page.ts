import { Component, OnInit, OnChanges, OnDestroy, ViewChild, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, of, Subscription } from "rxjs";
import { map, take, tap, switchMap, first } from "rxjs/operators";
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
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
import { ModalController, PopoverController } from "@ionic/angular";
import { OrderRowEditorComponent } from "../../shared/order-row-editor/order-row-editor.component";
import { datePickerObj } from "./date-picker-options";
import { EditOptionsPopoverComponent, PageActions } from "../../shared/edit-options-popover/edit-options-popover.component";
import { CanComponentDeactivate } from "../../providers/routGuards/can-deactivate.guard";

@Component({
  selector: "app-edit-order-header",
  templateUrl: "./edit-order-header.page.html",
  styleUrls: ["./edit-order-header.page.scss"]
})
export class EditOrderHeaderPage implements OnInit, OnDestroy, AfterViewInit, CanComponentDeactivate {
  packinglists: Observable<Extended<PackinglistInfo>[]>;
  actions = [PageActions.SAVE, PageActions.COPY, PageActions.DELETE];
  // orderId$: Observable<string>;
  v = datePickerObj;
  submitAttempt: boolean;
  orderId: string;
  order$: Observable<Extended<Order>>;
  form: FormGroup;
  sub: Subscription;
  newRowCtrol: FormControl;
  order: Extended<Order>;
  forProductId: string;
  @ViewChild('newRowComponent', { static: false }) newRowComponent: OrderRowEditorComponent;
  async canDeactivate(): Promise<boolean> {
    const topModal = await this.modalController.getTop();
    if (topModal) {
     // console.log(" A Modal is already opened , cant go back");
      topModal.dismiss();
      return false;
    }
    return true;
  }
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private ordersFsRep: OrdersDataService,
    private location: Location,
    private router: Router,
    private plInfoDataService: PackinglistInfoDataService,
    private modalController: ModalController,
    private popoverController: PopoverController
  ) {
    this.form = this.fb.group({
      date: "",
      orderNo: "",
      deliveryDate: "",
      notice: "",
      imageUrl: "",
      accountId: ['', Validators.required],
      ammount: [0,  Validators.compose([Validators.required, Validators.min(0)])],
      deposit:  [0,  Validators.min(0)],
      cbm: [0,  Validators.min(0)],
      isDelivered: false,
      isPaid: false,
      packingListId: ['', Validators.required],
      rows: this.fb.array([])
    });
    /*
    this.orderId$ = this.route.paramMap.pipe(
      map(value => {
        return value.get("id");
      })
    );
    */
    this.packinglists = this.plInfoDataService.List;
    this.order$ = this.route.paramMap.pipe(
      switchMap(paramMap => {
        let orderId = paramMap.get("id");
        const isForCopy = paramMap.get("copy") === 'copy';

        const packingListId = paramMap.get("plId");
        this.forProductId = paramMap.get("productId");
        const accountId = paramMap.get("accountId");
        if (orderId === "new" || !orderId) {
          if (packingListId || accountId || this.forProductId) {
            orderId = 'new';
          }
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
          const originalOrder = this.ordersFsRep.getExtended(orderId);
          if (isForCopy) {
            const CopyOrder = originalOrder.pipe(take(1), map(extOrder => {
              const orderDataCopy = JSON.parse(JSON.stringify(extOrder.data));
              const orderCopy = {
                ...extOrder, id: null,
                data: orderDataCopy
              };
              return orderCopy;
            }));
            return CopyOrder;
          } else {
            return originalOrder;
          }
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
  get deliveryDateCtrl() {
    return this.form.get("deliveryDate");
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

  addNewOrderRowForProduct(productId: string) {
    const newOrderRow: Extended<OrderRow2> = {
      data: { sequence: 0, productId },
      ext: { state: "EMPTY" }
    } as Extended<OrderRow2>;
    return this.addNewOrderRow(newOrderRow);
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

  onAction(action) {
    switch (action) {
      case PageActions.SAVE:
        this.onSubmit(this.form);
        break;
      case PageActions.COPY:
        break;
      case PageActions.DELETE:
        this.delete();
        break;
      default:
        break;
    }
  }



  showNewOrderRow() {
    this.addNewOrderRow();
  }

  showCopyOrderRow(orderRow: Extended<OrderRow2>) {
    const copyOrderRow = { ...orderRow };
    copyOrderRow.data = { ...copyOrderRow.data };
    copyOrderRow.ext = { ...copyOrderRow.ext, state: "NEW" };
    return this.addNewOrderRow(copyOrderRow);
  }

  dismiss(data: Extended<Order>, isDelete = false) {
    // if (data.data.packingListId && isDelete) {
    //   this.router.navigate(["/StoreBase/Packinglist", data.data.packingListId]);
    // }
    if (isDelete) {
      window.history.go(-2);
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
  ngAfterViewInit(): void {
    if (this.forProductId) {
      this.addNewOrderRowForProduct(this.forProductId);
    }
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
