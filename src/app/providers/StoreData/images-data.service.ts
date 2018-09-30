import { Injectable } from "@angular/core";
import { StoreDataService } from "./store-data.service";
import { ImageFile, Extended } from "../../interfaces/data-models";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActiveStoreService } from "../AppData/active-store.service";
import { StorePathConfig } from "../../interfaces/StorePathConfig";
import { ImageService, ImageMeta } from "../Image/image.service";

@Injectable({
  providedIn: "root"
})
export class ImagesDataService extends StoreDataService<ImageFile> {
  private formatedList;

  constructor(
    afs: AngularFirestore,
    private activeStoreService: ActiveStoreService,
    private imageService: ImageService
  ) {
    super(afs, activeStoreService, StorePathConfig.Images);
    console.log("Hello ImagesFsRepository Provider");
  }

  beforeImageUploaded(newImage: Extended<ImageFile>, newId?: string) {
    return super.saveNew(newImage, newId);
  }
  beforeImageRemoved(newImage: Extended<ImageFile>) {
    newImage.data.isDelted = true;
    return super.saveOld(newImage);
  }
  afterImageRemoved(removedItem: Extended<ImageFile>): any {
    super.remove(removedItem);
  }
  getByUrl(url) {
    const imageId = this.imageService.getImageId(url);
    return this.getOnce(imageId);
  }
  saveNewImage(imgMeta: ImageMeta, id?: string) {
    id = id || this.newKey();
    const newItem: ImageFile = {
      height: imgMeta.height,
      //  name: imgMeta.imageId,
      size: imgMeta.size,
      width: imgMeta.width
    } as ImageFile;
    return this.beforeImageUploaded({ data: newItem, id: null }, id).then(
      key => {
        return this.imageService
          .upload(imgMeta, key, this.activeStoreService.activeStoreKey)
          .then(res => {
            return Promise.all([res.imageTask, res.thumbTask]).then(
              ([imgSnapshot, thumbSnapshot]) => {
                newItem.url = imgSnapshot.downloadURL;
                newItem.thumbUrl = thumbSnapshot.downloadURL;
                return this.afterImageUploaded(null, { data: newItem, id });
              }
            );
          });
      }
    );
  }

  remove(removedItem: Extended<ImageFile>) {
    return this.beforeImageRemoved(removedItem).then(() => {
      return this.imageService.remove(removedItem.data).then(removeRes => {
        return this.afterImageRemoved(removedItem);
      });
    });
  }

  afterImageUploaded(
    oldImage: Extended<ImageFile>,
    newImage: Extended<ImageFile>
  ) {
    return super.saveOld(newImage);
  }
}
