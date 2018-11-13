import { Injectable } from "@angular/core";
import { StoreDataService } from "./store-data.service";
import { Order, Extended, ExtType } from "../../interfaces/data-models";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActiveStoreService } from "../AppData/active-store.service";
import { StorePathConfig } from "../../interfaces/StorePathConfig";
import { Observable } from "rxjs";
import { mergeMap, map, combineLatest } from "rxjs/operators";
import { compareTimeStamp } from "../../Util/compare-timetamp";
import { AccountsDataService } from "./accounts-data.service";
import { ImagesDataService } from "./images-data.service";

@Injectable({
  providedIn: "root"
})
export class OrdersDataService extends StoreDataService<Order> {
  constructor(
    afs: AngularFirestore,
    activeStoreService: ActiveStoreService,
    private accountsRep: AccountsDataService,
    private imagesFsRepository: ImagesDataService
  ) {
    super(afs, activeStoreService, StorePathConfig.Orders);
    console.log("Hello TransactionsFsRepository Provider");
  }
  forAccount(accountKey: string) {
    const OrdersColl = this.afs.collection<Order>(this.collection.ref.path, ref =>
      ref.where("accountId", "==", accountKey)
    );
    // const transactionsList = super.snapList(transactionsColl);
    const ordersMap = super.snapshotMap(OrdersColl.snapshotChanges());
    // return transactionsMap
    return ordersMap;
  }
  forPackingList(plId: string) {
    const OrdersColl = this.afs.collection<Order>(this.collection.ref.path, ref =>
      ref.where("packingListId", "==", plId)
    );
    // const transactionsList = super.snapList(transactionsColl);
    const ordersMap = super.snapList(OrdersColl.snapshotChanges());
    // return transactionsMap
    return ordersMap;
  }
  getExtended(key): Observable<Extended<Order>> {
    return super.get(key).pipe(
      mergeMap(order => {
        return this.accountsRep.get(order.data.accountId).pipe(
          map(extAccount => {
            order.ext = order.ext || {};
            order.ext.account = extAccount;
            return order;
          })
        );
      })
    );
  }
  get FormatedList(): Observable<any[]> {
    return this.List().pipe(
      /*  */

      combineLatest(this.accountsRep.dataMap, (orders, accountsMap) => {
        orders.forEach(order => {
          order.ext = order.ext || ({} as ExtType);
          order.ext.account = accountsMap.get(order.data.accountId);
        });
        return orders;
      }),
      map(ordersArray => {
        return ordersArray.sort((a, b) => {
          return compareTimeStamp(
            a.ext.$computedLastEditedOn,
            b.ext.$computedLastEditedOn
          );
        });
      })
    );
  }
}
