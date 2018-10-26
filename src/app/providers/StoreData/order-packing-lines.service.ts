import { Injectable } from "@angular/core";
import { StoreDataService } from "./store-data.service";
import { PLLine, Extended, ExtType } from "../../interfaces/data-models";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActiveStoreService } from "../AppData/active-store.service";
import { StorePathConfig } from "../../interfaces/StorePathConfig";
import { Observable } from "rxjs";
import { map, combineLatest, switchMap } from "rxjs/operators";
import { compareTimeStamp } from "../../Util/compare-timetamp";
import { OrdersDataService } from "./orders-data.service";
import { ProductsDataService } from "./products-data.service";

@Injectable({
  providedIn: "root"
})
export class OrderPackingLinesService extends StoreDataService<PLLine> {
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

    const OrderPLLinesColl$ = this.path$.pipe(map((path) => {
      return this.afs.collection<PLLine>(path, (ref) => ref.where('orderId', '==', orderKey));
    }));

    const orderPLLinesList = OrderPLLinesColl$.pipe(switchMap((orderPLLinesColl) => {
      return super.snapList(orderPLLinesColl.snapshotChanges());
  }));
/*
    const OrderPLLinesColl = this.afs.collection<PLLine>(
      this.collection.ref.path,
      ref => ref.where("orderId", "==", orderKey)
    );
    // const transactionsList = super.snapList(transactionsColl);
    const orderPLLinesMap = super.snapList(OrderPLLinesColl.snapshotChanges());
    */
    // return transactionsMap
    return this.formateList(orderPLLinesList);
  }
  get FormatedList(): Observable<Extended<PLLine>[]> {
    return this.formateList(this.List());
  }
  formateList(
    list: Observable<Extended<PLLine>[]>
  ): Observable<Extended<PLLine>[]> {
    return list.pipe(
      /*  */
      combineLatest(this.productsRep.dataMap, (orderPLLines, productsMap) => {
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
