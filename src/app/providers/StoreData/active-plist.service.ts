import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, merge } from 'rxjs';
import { flatMap, shareReplay, map, tap, filter } from 'rxjs/operators';
import { ActiveStoreService } from '../AppData/active-store.service';
import { PackinglistInfoDataService } from './packinglist-info-data.service';
import { OrdersDataService } from './orders-data.service';
import { Extended, PackinglistInfo, Order, OrderRow2, Product } from '../../interfaces/data-models';
import { ProductsDataService } from './products-data.service';


@Injectable({
  providedIn: 'root'
})
export class ActivePListService {
  _activePlistId: string;
  activePListIdSubject: Subject<string>;
  activePlistId: Observable<string>;
  activePlist: Observable<Extended<PackinglistInfo>>;
  activePlistOrders: Observable<Extended<Order>[]>;
  activePlistOrderRows: Observable<Extended<OrderRow2>[]>;
  activePlistProducts: Observable<Extended<Product>[]>;

  constructor(
    private activeStoreService: ActiveStoreService,
    private pListService: PackinglistInfoDataService,
    private ordersService: OrdersDataService,
    private productsRep: ProductsDataService
  ) {
    // this._activePlistId = this.getDefaultPlistId();
    this.activePListIdSubject = new Subject();
    const obs = this.activePListIdSubject.asObservable().pipe(shareReplay(1)
      // , tap(id => {
      //   console.log("GGGGGGGGGKs : ", id);
      // })
    );

    this.activePlistId = merge(this.getDefaultPlistId$(), obs).pipe(shareReplay(1)
      // , tap(id => {
      //   console.log("HUHOHOHOIHIOHOH : ", id);
      // })
    );
    this.activePlistId.subscribe(h => {
      console.log("HHHHHHHHHHHH : ", h);
    });
    this.activePlist = this.activePlistId.pipe(flatMap(id => this.pListService.get(id)), shareReplay(1));
    const filteredOrders = this.activePlistId.pipe(
      filter((id, i) => !!id),
      flatMap(id => this.ordersService.forPackingList(id)),
      shareReplay(1));
    const allOrders = this.activePlistId.pipe(
      filter((id, i) => !id),
      flatMap(id => this.ordersService.FormatedList),
      shareReplay(1));
    this.activePlistOrders = merge(filteredOrders, allOrders).pipe(shareReplay(1));
    this.activePlistOrderRows = this.activePlistOrders.pipe(
      map(extOrders => {
        const temp = [].concat(
          ...extOrders.map(extOrder => extOrder.ext.extRows)
        ) as Extended<OrderRow2>[];

        return temp;
      }), shareReplay(1)
    );
    const allProducts = this.activePlistId.pipe(filter((id, index) => !id), flatMap(() => this.productsRep.List));
    const allOrdersproducts = this.activePlistOrderRows.pipe(map((plRows) => {
      console.log(plRows);
      const prods = plRows.map(plRow => plRow.ext.Product);
      return Array.from(new Set(prods));
    }
    ));
    const filteredProducts = this.activePlistId.pipe(filter((id, index) => !!id), flatMap(() => allOrdersproducts));



    this.activePlistProducts = merge(allProducts, filteredProducts).pipe(shareReplay(1));
  }

  setDefaultPlistId(val: string) {
    this._activePlistId = val;
    this.activePListIdSubject.next(val);
    window.localStorage.setItem(this.activeStoreService.activeStoreInfoValue.id + '.DEFAULTPLIST', val);
  }
  getDefaultPlistId() {
    // return "";
    return window.localStorage.getItem(this.activeStoreService.activeStoreInfoValue.id + '.DEFAULTPLIST');
  }
  getDefaultPlistId$() {
    // return "";
    return this.activeStoreService.activeStoreKey$.pipe(map(id => {
      const res = window.localStorage.getItem(id + '.DEFAULTPLIST');
      if (res === "undefined") {
        return undefined;
      }
      return res;
    }));
  }
}
