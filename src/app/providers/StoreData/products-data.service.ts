import { Injectable } from "@angular/core";
import { StoreDataService } from "./store-data.service";
import { Product, Extended } from "../../interfaces/data-models";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActiveStoreService } from "../AppData/active-store.service";
import { StorePathConfig } from "../../interfaces/StorePathConfig";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { compareTimeStamp } from "../../Util/compare-timetamp";

@Injectable({
  providedIn: "root"
})
export class ProductsDataService extends StoreDataService<Product> {
  constructor(afs: AngularFirestore, activeStoreService: ActiveStoreService) {
    super(afs, activeStoreService, StorePathConfig.ProductsInfo);
    console.log("Hello ProductsFBRepository Provider");
  }
  get FormatedList(): Observable<Extended<Product>[]> {
    return this.List().pipe(
      map(productsArray => {
        return productsArray.sort((a, b) => {
          return compareTimeStamp(
            a.ext.$computedLastEditedOn,
            b.ext.$computedLastEditedOn
          );
        });
      })
    );
  }
}
