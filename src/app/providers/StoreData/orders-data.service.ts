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
import { Observable, combineLatest } from "rxjs";
import { mergeMap, map, share, flatMap, take } from "rxjs/operators";
import { AccountsDataService } from "./accounts-data.service";
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
  fixOrderProducts() {
    this.list.pipe(take(1)).subscribe((orders) => {
      orders.forEach((order) => {
        const productIds = order.data.rows.map(row => row.productId);
        console.log("order products ", productIds);
         order.data.products = productIds;
          this.saveOld(order);
      });
    });
  }

  fixOrderProducts1(order: Extended<Order>) {
        const productIds = order.data.rows.map(row => row.productId);
        console.log("order products ", productIds);
         order.data.products = productIds;
         return order;
        //  this.saveOld(order);
  }
  saveNew(order: Extended<Order>, key?) {
    order = this.fixOrderProducts1(order);
    return super.saveNew(order, key);
  }
  saveOld(order: Extended<Order>) {
    order = this.fixOrderProducts1(order);
    return super.saveOld(order);
  }
  forAccount(accountKey: string) {

    const ordersMap = this.path$.pipe(map(path => {
      const OrdersColl = this.afs.collection<Order>(
        path,
        ref => ref.where("accountId", "==", accountKey)
      );
      return OrdersColl;
    }), flatMap((afColl => {
      return super.snapList(afColl.snapshotChanges());
    })));

    return ordersMap;
  }
  forProduct(productId: string) {
    const ordersMap = this.path$.pipe(map(path => {
      const OrdersColl = this.afs.collection<Order>(
        path,
        ref => ref.where("products", "array-contains", productId)
      );
      return OrdersColl;
    }), flatMap((afColl => {
      return super.snapList(afColl.snapshotChanges());
    })));

    // return ordersMap;
    return this.extendList(ordersMap);
  }
  forPackingList(plId: string) {
    const ordersList = this.path$.pipe(map(path => {
      const OrdersColl = this.afs.collection<Order>(
        path,
        ref => ref.where("packingListId", "==", plId)
      );
      return OrdersColl;
    }), flatMap((afColl => {
      return super.snapList(afColl.snapshotChanges());
    })));

    return this.extendList(ordersList);
  }
  getExtended(key): Observable<Extended<Order>> {
    const self = this;
    return super.get(key).pipe(
      mergeMap(order => {
        return combineLatest([this.accountsRep.get(order.data.accountId), this.productsDataService.DataMap]).pipe(
          map(([extAccount, productsMap]) => {
            order.ext = order.ext || {};
            order.ext.account = extAccount;
            order.ext.extRows = self.extendRows(order, productsMap);
            return order;
          })
        );
      })
    );
  }
  get FormatedList(): Observable<Extended<Order>[]> {
    return this.extendList(this.list);
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
  extendList(list: Observable<Extended<Order>[]>) {
    return combineLatest([list,
      this.accountsRep.DataMap,
      this.productsDataService.DataMap]).pipe(map(([orders, accountsMap, productsMAp]) => {
        orders.forEach(order => {
          order.ext = order.ext || ({} as ExtType);
          order.ext.account = accountsMap.get(order.data.accountId);
          order.ext.extRows = this.extendRows(order, productsMAp);
        });
        return orders;
      }
      ),
      );
  }
}
