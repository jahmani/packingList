import { Component, OnInit } from "@angular/core";
import {
  PackinglistInfo,
  Extended,
  Order,
  OrderRow,
  PackingLine
} from "../../interfaces/data-models";
import { Observable, combineLatest } from "rxjs";
import { OrdersDataService } from "../../providers/StoreData/orders-data.service";
import { OrderRowsService } from "../../providers/StoreData/order-rows.service";
import { ActivatedRoute } from "@angular/router";
import { PackinglistInfoDataService } from "../../providers/StoreData/packinglist-info-data.service";
import { map, switchMap, mergeMap, mergeAll, zip, share } from "rxjs/operators";

@Component({
  selector: "app-packinglist",
  templateUrl: "./packinglist.page.html",
  styleUrls: ["./packinglist.page.scss"]
})
export class PackinglistPage implements OnInit {
  plId: Observable<string>;
  plInfo: Observable<Extended<PackinglistInfo>>;
  plOrders: Observable<Extended<Order>[]>;
  plOrdersRows: Observable<Extended<OrderRow>[]>;
  plOrdersLines: Observable<Extended<PackingLine>[]>;
  display: "orders" | "lines" | "rows" = "orders";

  constructor(
    private ordersFsRep: OrdersDataService,
    private packinglistInfoDataService: PackinglistInfoDataService,
    private pLLinesFsRepository: OrderRowsService,
    public rout: ActivatedRoute
  ) {
    this.plId = this.rout.paramMap.pipe(map(paramMap => paramMap.get("id")));
    this.plInfo = this.plId.pipe(
      switchMap(id => {
        return this.packinglistInfoDataService.get(id);
      })
    );

    this.plOrders = this.plId.pipe(
      switchMap(plId => {
        return this.ordersFsRep.forPackingList(plId);
      })
    );
    this.plOrdersRows = this.plOrders.pipe(
      switchMap(extOrders => {
        const latest = combineLatest(
          extOrders.map(extOrder => {
            const rows = this.pLLinesFsRepository.forOrder(extOrder.id);
            return rows;
          })
        ).pipe(
          map(res => {
            const arr: Extended<OrderRow>[] = [];
            return arr.concat(...res);
          })
        );
        return latest;
      }), share()
    );
  }

  ngOnInit() {}
}
