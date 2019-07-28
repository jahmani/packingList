import { Injectable } from "@angular/core";
import { StoreDataService } from "./store-data.service";
import { Product, Extended, ExtMap, ImageFile } from "../../interfaces/data-models";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActiveStoreService } from "../AppData/active-store.service";
import { StorePathConfig } from "../../interfaces/StorePathConfig";
import { Observable } from "rxjs";
import { map, combineLatest } from "rxjs/operators";
import { compareTimeStamp } from "../../Util/compare-timetamp";
import { ImagesDataService } from "./images-data.service";
import { ImageService } from "../Image/image.service";

@Injectable({
  providedIn: "root"
})
export class ProductsDataService extends StoreDataService<Product> {
  constructor(afs: AngularFirestore, activeStoreService: ActiveStoreService, private imagesDataService: ImagesDataService,
    private imagesService: ImageService) {
    super(afs, activeStoreService, StorePathConfig.ProductsInfo);
    console.log("Hello ProductsFBRepository Provider");
  }
  get FormatedList(): Observable<Extended<Product>[]> {
    return this.list.pipe(
      combineLatest(this.imagesDataService.dataMap),
      map(([productsArray, imgMap]) => {
        return productsArray.map((prod => this.extendImage(prod, imgMap))).sort((a, b) => {
          return compareTimeStamp(
            a.ext.$computedLastEditedOn,
            b.ext.$computedLastEditedOn
          );
        });
      })
    );
  }

  extendImage(product: Extended<Product>, imgMap: ExtMap<Extended<ImageFile>> ) {
    product.ext = product.ext || {};
    if (product.data.thumbUrl) {
      const imgId = this.imagesService.getImageId( product.data.thumbUrl);
      const imgFile = imgMap.get(imgId);
      product.ext.imageFile = imgFile;
    }
    return product;
  }
}
