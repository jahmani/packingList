import { Injectable } from "@angular/core";
import { StoreDataService } from "./store-data.service";
import {
  Order,
  Extended,
  ExtType,
  OrderRow2,
  ExtMap,
  Product
} from "../../interfaces/data-models";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActiveStoreService } from "../AppData/active-store.service";
import { StorePathConfig } from "../../interfaces/StorePathConfig";
import { Observable } from "rxjs";
import { mergeMap, map, combineLatest, share } from "rxjs/operators";
import { compareTimeStamp } from "../../Util/compare-timetamp";
import { AccountsDataService } from "./accounts-data.service";
import { ImagesDataService } from "./images-data.service";
import { ProductsDataService } from "./products-data.service";

@Injectable({
  providedIn: "root"
})
export class OrdersDataService extends StoreDataService<Order> {
  constructor(
    afs: AngularFirestore,
    activeStoreService: ActiveStoreService,
    private accountsRep: AccountsDataService,
    private productsDataService: ProductsDataService
  ) {
    super(afs, activeStoreService, StorePathConfig.Orders);
    console.log("Hello TransactionsFsRepository Provider");
  }
  forAccount(accountKey: string) {
    const OrdersColl = this.afs.collection<Order>(
      this.collection.ref.path,
      ref => ref.where("accountId", "==", accountKey)
    );
    // const transactionsList = super.snapList(transactionsColl);
    const ordersMap = super.snapshotMap(OrdersColl.snapshotChanges());
    // return transactionsMap
    return ordersMap;
  }
  forPackingList(plId: string) {
    const OrdersColl = this.afs.collection<Order>(
      this.collection.ref.path,
      ref => ref.where("packingListId", "==", plId)
    );

    const ordersMap = super.snapList(OrdersColl.snapshotChanges());

    return this.formateList(ordersMap);
  }
  getExtended(key): Observable<Extended<Order>> {
    return super.get(key).pipe(
      mergeMap(order => {
        return this.accountsRep.get(order.data.accountId).pipe(
          combineLatest(this.productsDataService.dataMap),
          map(([extAccount, productsMap]) => {
            order.ext = order.ext || {};
            order.ext.account = extAccount;
            order.ext.extRows = this.extendRows(order, productsMap);
            return order;
          })
        );
      })
    );
  }
  get FormatedList(): Observable<any[]> {
    return this.formateList(this.List());
  }
  private extendRows(
    order: Extended<Order>,
    productsMAp: ExtMap<Extended<Product>>
  ) {
    return order.data.rows.map(row => {
      const extRow: Extended<OrderRow2> = { ext: {} } as Extended<OrderRow2>;
      extRow.data = row;
      extRow.ext.Product = productsMAp.get(extRow.data.productId);
      return extRow;
    });
  }
  formateList(list: Observable<Extended<Order>[]>) {
    return list.pipe(
      /*  */

      combineLatest(
        this.accountsRep.dataMap,
        this.productsDataService.dataMap,
        (orders, accountsMap, productsMAp) => {
          orders.forEach(order => {
            order.ext = order.ext || ({} as ExtType);
            order.ext.account = accountsMap.get(order.data.accountId);
            order.ext.extRows = this.extendRows(order, productsMAp);
          });
          return orders;
        }
      ),
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
