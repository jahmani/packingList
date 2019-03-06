import { Injectable } from "@angular/core";
import { Product, Extended, ExtMap, ImageFile } from "../../interfaces/data-models";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActiveStoreService } from "../AppData/active-store.service";
import { StorePathConfig } from "../../interfaces/StorePathConfig";
import { Observable } from "rxjs";
import { map, combineLatest } from "rxjs/operators";
import { compareTimeStamp } from "../../Util/compare-timetamp";
import { ImageService } from "../Image/image.service";
import { StoreDataService } from "../StoreData/store-data.service";
import { FirestoreData } from "../AppData/firestore-data";
import { conatctPaths } from "../../Util/contact-paths";

@Injectable({
  providedIn: "root"
})
export class CatalogService {
  constructor(private afs: AngularFirestore, private imagesService: ImageService) {

  }
  forStore(storeId) {
    const imgDataService = new ImagesDataService(this.afs, this.imagesService , storeId);
    const prodDataService = new ProductsService(this.afs, imgDataService, this.imagesService , storeId);
    return prodDataService;
  }
}

  export class ProductsService extends FirestoreData<Product> {
    constructor(
      afs: AngularFirestore,
       private imagesDataService: ImagesDataService,
       private imagesService: ImageService,
       storePath
    ) {
    super(afs, conatctPaths(StorePathConfig.basePath, storePath, StorePathConfig.ProductsInfo) );
    console.log("Hello ProductsFBRepository Provider");
  }
  get FormatedList(): Observable<Extended<Product>[]> {
    return this.List().pipe(
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

  extendImage(product: Extended<Product>, imgMap: ExtMap<Extended<ImageFile>>) {
    product.ext = product.ext || {};
    if (product.data.thumbUrl) {
      const imgId = this.imagesService.getImageId(product.data.thumbUrl);
      const imgFile = imgMap.get(imgId);
      product.ext.imageFile = imgFile;
    }
    return product;
  }
  ForStore2(storeId) {

  }
}


export class ImagesDataService extends FirestoreData<ImageFile> {
  extendedList: Observable<Extended<ImageFile>[]>;

  constructor(
    afs: AngularFirestore,    private imageService: ImageService,        storePath


  ) {
    super(afs, conatctPaths(StorePathConfig.basePath, storePath, StorePathConfig.Images));
    console.log("Hello ImagesFsRepository Provider");
  }

}


