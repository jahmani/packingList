import { Component, OnInit } from "@angular/core";
import {
  PackinglistInfo,
  Extended,
  Order,
  OrderRow,
  PackingLine,
  OrderRow2
} from "../../interfaces/data-models";
import { Observable, combineLatest } from "rxjs";
import { OrdersDataService } from "../../providers/StoreData/orders-data.service";
// import { OrderRowsService } from "../../providers/StoreData/order-rows.service";
import { ActivatedRoute } from "@angular/router";
import { PackinglistInfoDataService } from "../../providers/StoreData/packinglist-info-data.service";
import {
  map,
  switchMap,
  mergeMap,
  mergeAll,
  zip,
  share,
  shareReplay,
  tap
} from "rxjs/operators";
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
export class PackinglistPage implements OnInit {
  plId: Observable<string>;
  plInfo: Observable<Extended<PackinglistInfo>>;
  plOrders: Observable<Extended<Order>[]>;
  plOrdersRows: Observable<Extended<OrderRow2>[]>;
  plOrdersLines: Observable<Extended<PackingLine>[]>;
  display: "orders" | "lines" | "rows" = "orders";
  totals: Totals;

  constructor(
    private ordersFsRep: OrdersDataService,
    private packinglistInfoDataService: PackinglistInfoDataService,
    //  private pLLinesFsRepository: OrderRowsService,
    public rout: ActivatedRoute
  ) {
    this.plId = this.rout.paramMap.pipe(map(paramMap => paramMap.get("id")));
    this.plInfo = this.plId.pipe(
      switchMap(id => {
        return this.packinglistInfoDataService.get(id);
      })
    );
    this.totals = { ammount: 0, pieces: 0, ctns: 0, cbm: 0, deposit: 0 };
    this.plOrders = this.plId.pipe(
      switchMap(plId => {
        return this.ordersFsRep.forPackingList(plId);
      }),
      tap(extOrders => {
        let subTotal = { cbm: 0, deposit: 0 };
        subTotal = extOrders.reduce<{ cbm: number, deposit: number }>((accum, curr) => {
          accum.cbm += Number(curr.data.cbm);
          accum.deposit += Number(curr.data.deposit);
          return accum;
        }, subTotal);
        this.totals = { ...this.totals, ...subTotal };
      }),
      shareReplay(1)
    );
    this.plOrdersRows = this.plOrders.pipe(
      map(extOrders => {
        const temp = [].concat(
          ...extOrders.map(extOrder => extOrder.ext.extRows)
        ) as Extended<OrderRow2>[];

        return temp;
      }),
      tap(extOrders => {
        let subTotal = { ammount: 0, pieces: 0, ctns: 0 };
        subTotal = extOrders.reduce<Partial<Totals>>((accum, curr) => {
          accum.ammount += Number(curr.data.ammount);
          let lines = curr.data.packingLines;
          if (!lines) { lines = []; }
          accum.ctns += lines.reduce<number>(
            (accm, crr) => (accm += Number(crr.ctns)),
            0
          );
          accum.pieces += Number(curr.data.qty);
          return accum;
        }, subTotal) as any;
        this.totals = { ...this.totals, ...subTotal };
      }),

      shareReplay(1)
    );
  }

  ngOnInit() {}
}
