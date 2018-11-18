import { Injectable } from "@angular/core";
import { StoreDataService } from "./store-data.service";
import { OrderRow, Extended, ExtType, OrderRow2 } from "../../interfaces/data-models";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActiveStoreService } from "../AppData/active-store.service";
import { StorePathConfig } from "../../interfaces/StorePathConfig";
import { Observable, combineLatest } from "rxjs";
import { map, switchMap, first, tap } from "rxjs/operators";
import { compareTimeStamp } from "../../Util/compare-timetamp";
import { OrdersDataService } from "./orders-data.service";
import { ProductsDataService } from "./products-data.service";

@Injectable({
  providedIn: "root"
})
export class OrderRowsService extends StoreDataService<OrderRow> {
  private formatedList;

  constructor(
    afs: AngularFirestore,
    activeStoreService: ActiveStoreService,
    private ordersRep: OrdersDataService,
    private productsRep: ProductsDataService
  ) {
    super(afs, activeStoreService, StorePathConfig.OrderPLLines);
    console.log("Hello OrderPLLinesPLLinesFsRepository Provider");
  }

  forOrder(orderKey: string) {
    const OrderRowsColl$ = this.path$.pipe(
      map(path => {
        return this.afs.collection<OrderRow>(path, ref =>
          ref.where("orderId", "==", orderKey)
        );
      })
    );

    const orderRowssList = OrderRowsColl$.pipe(
      switchMap(orderRowssColl => {
        return super.snapList(orderRowssColl.snapshotChanges());
      })
    );
    return this.formateList(orderRowssList);
  }
  get FormatedList(): Observable<Extended<OrderRow>[]> {
    return this.formateList(this.List());
  }

  copyOrderRows() {
    this.ordersRep.List().pipe(first() ,
      tap(extOrders => {
        extOrders.forEach(extOrder => {
          this.forOrder(extOrder.id).pipe( first() ,
            tap(rows => {
              let sequence = 0;
              const rowsMap = rows.map((curr) => {
                delete (curr.data).lastEditedOn;
                delete (curr.data).lastEditedByUserId;
                delete (curr.data).firstCreatedOn;
                delete (curr.data).ctns;
                delete (curr.data).packing;
                const res = { ...curr.data, sequence: sequence++ } as any;
                return res;
              });
              extOrder.data.rows = rowsMap;
              this.ordersRep.saveOld(extOrder);
            })
          ).subscribe(console.log);
        });
      })
    ).subscribe(console.log);
  }


  formateList(
    list: Observable<Extended<OrderRow>[]>
  ): Observable<Extended<OrderRow>[]> {
    return combineLatest(list, this.productsRep.dataMap).pipe(
      map(([orderPLLines, productsMap]) => {
        orderPLLines.forEach(orderPLLine => {
          orderPLLine.ext = orderPLLine.ext || ({} as ExtType);
          orderPLLine.ext.Product = productsMap.get(orderPLLine.data.productId);
        });
        return orderPLLines;
      }),
      map(orderPLLinesArray => {
        return orderPLLinesArray.sort((a, b) => {
          return compareTimeStamp(
            a.ext.$computedLastEditedOn,
            b.ext.$computedLastEditedOn
          );
        });
      })
    );
  }
}
