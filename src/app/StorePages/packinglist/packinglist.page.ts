import { Component, OnInit } from "@angular/core";
import {
  PackinglistInfo,
  Extended,
  Order,
  OrderRow,
  PackingLine,
  OrderRow2,
  Product
} from "../../interfaces/data-models";
import { Observable, combineLatest } from "rxjs";
import { OrdersDataService } from "../../providers/StoreData/orders-data.service";
// import { OrderRowsService } from "../../providers/StoreData/order-rows.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PackinglistInfoDataService } from "../../providers/StoreData/packinglist-info-data.service";
import {
  map,
  switchMap,
  shareReplay,
  tap,
  startWith
} from "rxjs/operators";
import { ActivePListService } from "../../providers/StoreData/active-plist.service";
import { SeoService } from "../../seo.service";
import { FormControl } from "@angular/forms";
import { PageActions } from "../../shared/edit-options-popover/edit-options-popover.component";
interface Totals {
  ammount: number;
  pieces: number;
  deposit: number;
  ctns: number;
  cbm: number;
}
@Component({
  selector: "app-packinglist",
  templateUrl: "./packinglist.page.html",
  styleUrls: ["./packinglist.page.scss"]
})
export class PackinglistPage {
  pageActions: PageActions[] = [PageActions.ADDNEW, PageActions.REORDER, PageActions.FILTER];
  plId: Observable<string>;
  plInfo: Observable<Extended<PackinglistInfo>>;
  plOrders: Observable<Extended<Order>[]>;
  plOrdersRows: Observable<Extended<OrderRow2>[]>;
  // plOrdersLines: Observable<Extended<PackingLine>[]>;
  reorderOrders = false;
  display: "orders" | "lines" | "rows" = "orders";
  // totals: Totals;
  public show = new FormControl('ALL');

  productList: Observable<Extended<Product>[]>;
  totals$: Observable<Totals>;
  plIdInstance: string;

  constructor(
    private packinglistInfoDataService: PackinglistInfoDataService,
    private apli: ActivePListService,
    //  private pLLinesFsRepository: OrderRowsService,
    public rout: ActivatedRoute,
    private seos: SeoService,
    private router: Router,

  ) {
    // this.plId = this.rout.paramMap.pipe(map(paramMap => paramMap.get("id")));
    this.show.valueChanges.subscribe(console.log);

    this.plId = this.apli.activePlistId;
    this.plInfo = this.plId.pipe( tap(id => {
      this.plIdInstance = id;
    }),
      switchMap(id => {
        return this.packinglistInfoDataService.get(id);
      })
    );

    // this.totals = { ammount: 0, pieces: 0, ctns: 0, cbm: 0, deposit: 0 };
    // this.plOrders = this.plId.pipe(
    //   switchMap(plId => {
    //     return this.ordersFsRep.forPackingList(plId);
    //   }),
    //   tap(extOrders => {
    //     let subTotal = { cbm: 0, deposit: 0 };
    //     subTotal = extOrders.reduce<{ cbm: number, deposit: number }>((accum, curr) => {
    //       accum.cbm += Number(curr.data.cbm);
    //       accum.deposit += Number(curr.data.deposit);
    //       return accum;
    //     }, subTotal);
    //     this.totals = { ...this.totals, ...subTotal };
    //   }),
    //   shareReplay(1)
    // );
    const showChanges = this.show.valueChanges.pipe(startWith("ALL"));
    this.plOrders = combineLatest([this.apli.activePlistOrders, showChanges]).pipe(
      map(([extOrders, showVal]) => {
        if (showVal === "NOTDELIVERED") {
          return extOrders.filter(or => !or.data.isDelivered);
        } else if (showVal === "DELIVERED") {
          return extOrders.filter(or => or.data.isDelivered);
        } else {
          return extOrders;
        }
      }), shareReplay(1)
    );
    this.plOrdersRows = this.plOrders.pipe(
      map(this.convertToRows),
    );

    // this.plOrdersRows = this.apli.activePlistOrderRows.pipe(
    //   tap(extOrders => {
    //     let subTotal = { ammount: 0, pieces: 0, ctns: 0 };
    //     subTotal = extOrders.reduce<Partial<Totals>>((accum, curr) => {
    //       accum.ammount += Number(curr.data.ammount);
    //       let lines = curr.data.packingLines;
    //       if (!lines) { lines = []; }
    //       accum.ctns += lines.reduce<number>(
    //         (accm, crr) => (accm += Number(crr.ctns)),
    //         0
    //       );
    //       accum.pieces += Number(curr.data.qty);
    //       return accum;
    //     }, subTotal) as any;
    //     this.totals = { ...this.totals, ...subTotal };
    //   }),
    // )
    //   ;
    // this.plOrdersRows = this.plOrders.pipe(
    //   map(extOrders => {
    //     const temp = [].concat(
    //       ...extOrders.map(extOrder => extOrder.ext.extRows)
    //     ) as Extended<OrderRow2>[];

    //     return temp;
    //   }),
    //   tap(extOrders => {
    //     let subTotal = { ammount: 0, pieces: 0, ctns: 0 };
    //     subTotal = extOrders.reduce<Partial<Totals>>((accum, curr) => {
    //       accum.ammount += Number(curr.data.ammount);
    //       let lines = curr.data.packingLines;
    //       if (!lines) { lines = []; }
    //       accum.ctns += lines.reduce<number>(
    //         (accm, crr) => (accm += Number(crr.ctns)),
    //         0
    //       );
    //       accum.pieces += Number(curr.data.qty);
    //       return accum;
    //     }, subTotal) as any;
    //     this.totals = { ...this.totals, ...subTotal };
    //   }),

    //   shareReplay(1)
    // );

    // this.productList = this.plOrdersRows.pipe(map((plRows) => {
    //   const prods = plRows.map(plRow => plRow.ext.Product);
    //   return Array.from(new Set(prods));
    // }
    // ));
    this.totals$ = combineLatest([this.plOrders, this.plOrdersRows]).pipe(map(([orders, rows]) => {
      const zeroTotal = { ammount: 0, pieces: 0, ctns: 0, cbm: 0, deposit: 0 };
      const ordersTotal = this.computOrderTotal(orders, zeroTotal);
      const rowsTotal = this.computeRowTotal(rows, ordersTotal);
      return rowsTotal;
    }));
  }
  convertToRows(extOrders: Extended<Order>[]) {
    const temp = [].concat(
      ...extOrders.map(extOrder => extOrder.ext.extRows)
    ) as Extended<OrderRow2>[];

    return temp;
  }
  computOrderTotal(extOrders: Extended<Order>[], intial: Totals) {
    // let subTotal = { cbm: 0, deposit: 0 };
    return extOrders.reduce<Totals>((accum, curr) => {
      accum.cbm += Number(curr.data.cbm);
      accum.deposit += Number(curr.data.deposit);
      return accum;
    }, intial);
    // this.totals = { ...this.totals, ...subTotal };
  }
  computeRowTotal(extOrders: Extended<OrderRow2>[], intial: Totals) {
    // let subTotal = { ammount: 0, pieces: 0, ctns: 0 };
    return extOrders.reduce<Totals>((accum, curr) => {
      accum.ammount += Number(curr.data.ammount);
      let lines = curr.data.packingLines;
      if (!lines) { lines = []; }
      accum.ctns += lines.reduce<number>(
        (accm, crr) => (accm += Number(crr.ctns)),
        0
      );
      accum.pieces += Number(curr.data.qty);
      return accum;
    }, intial);
    // return this.totals ;
  }
  openOrder(id: string) {
    this.router.navigateByUrl(this.router.url + "/OrderView/" + id);
  }
  newOrder() {
    this.router.navigate(['/StoreBase/EditOrderHeader/new', {  plId: this.plIdInstance }]);
  }

  onReorderFinsh($event: string[], plist: Extended<PackinglistInfo>) {
    plist.data.manualOrder = $event;
    this.packinglistInfoDataService.saveOld(plist);
  }
  ionViewDidEnter() {
    this.seos.generateTags({ title: "Packing List" });
  }
  onAction(action: PageActions) {
    switch (action) {
      case PageActions.REORDER:
        this.reorderOrders = !this.reorderOrders;
        break;
      case PageActions.ADDNEW:
        this.newOrder();
        break;
      default:
        break;
    }
  }
}
