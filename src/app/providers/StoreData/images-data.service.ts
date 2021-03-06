import { Injectable } from "@angular/core";
import { StoreDataService } from "./store-data.service";
import { ImageFile, Extended, ImageSaveInfo } from "../../interfaces/data-models";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActiveStoreService } from "../AppData/active-store.service";
import { StorePathConfig } from "../../interfaces/StorePathConfig";
import { ImageService } from "../Image/image.service";
import { combineLatest, forkJoin, Observable } from "rxjs";
import { finalize, map, last, switchMap, catchError, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ImagesDataService extends StoreDataService<ImageFile> {
  private pendingUploads: Map<string, ImageSaveInfo> = new Map();
  extendedList: Observable<Extended<ImageFile>[]>;

  constructor(
    afs: AngularFirestore,
    private activeStoreService: ActiveStoreService,
    private imageService: ImageService
  ) {
    super(afs, activeStoreService, StorePathConfig.Images);
    console.log("Hello ImagesFsRepository Provider");
    this.extendedList = this.extendList(this.list);
  }
  private extendList(list: Observable<Extended<ImageFile>[]>) {
    return this.list.pipe(
      map(extImages => {
        return extImages.map(extImage => {
          if (!extImage.data.isUploaded) {
            extImage.ext.imgSaveInfo = this.pendingUploads.get(extImage.id);
          }
          return extImage;
        });
      })
    );
  }

  getByUrl(url) {
    const imageId = this.imageService.getImageId(url);
    return this.getOnce(imageId);
  }
  async saveNewImage(imageSaveInfo: ImageSaveInfo, id?: string) {
    const key = id || await this.newKey();
    // const folder = this.activeStoreService.activeStoreKey;
    const folder = await this.activeStoreService.getlatest();
    const ImgSaveInfo = await this.imageService.extendImageSaveInfo(
      imageSaveInfo,
      key,
      folder
    );
    this.pendingUploads.set(key, ImgSaveInfo);
    const extImage = await this.beforeImageUploaded(key, ImgSaveInfo);

    const uploadRes = await this.imageService.upload(
      ImgSaveInfo,
      key,
      folder
    );
    ImgSaveInfo.uploadRes = uploadRes;
    imageSaveInfo.downloadUrl = uploadRes.imageTask.snapshotChanges().pipe(
      last(),
      switchMap(() => imageSaveInfo.imageRef.getDownloadURL()),
      switchMap((url) => {
        return this.afterImageUploaded(extImage, { url, thumbUrl: null }).then(() => {
          URL.revokeObjectURL(imageSaveInfo.editedBlobUrl);
          this.pendingUploads.delete(extImage.id);
          return url;
        });
      })
    );

    //    if (uploadRes.imageTask) {
    // if (uploadRes.thumbTask) {
    //   forkJoin(
    //     uploadRes.imageTask.snapshotChanges(),
    //     uploadRes.thumbTask.snapshotChanges()
    //   )
    //     .pipe(
    //       switchMap(any => {
    //         return combineLatest(
    //           ImgSaveInfo.imageRef.getDownloadURL(),
    //           ImgSaveInfo.thumbRef.getDownloadURL()
    //         );
    //       }),
    //       catchError(err => {
    //         console.log("Error upload image", err);
    //         throw err;
    //       })
    //     )
    //     // todo:
    //     .subscribe(([url, thumbUrl]) => {
    //       return this.afterImageUploaded(extImage, { url, thumbUrl }).then(() => {
    //         this.pendingUploads.delete(extImage.id);
    //       });
    //     });
    // } else {
    // return uploadRes.imageTask.snapshotChanges().toPromise().then(() => {
    // uploadRes.imageTask.snapshotChanges()
    //   .pipe(
    //     finalize(() => {
    // //      ImgSaveInfo.downloadUrl = imageSaveInfo.imageRef.getDownloadURL();
    // ImgSaveInfo.downloadUrl.subscribe();
    //   })
    // )
    // .subscribe();
    // ImgSaveInfo.imageRef.getDownloadURL()

    //   // todo:
    //   .pipe(map(data => data as string), tap(((url) => {
    //     // ImgSaveInfo.downloadUrl = url;
    //     return this.afterImageUploaded(extImage, { url, thumbUrl: null }).then(() => {
    //       URL.revokeObjectURL(uploadRes.imgSaveInfo.editedBlobUrl);
    //       this.pendingUploads.delete(extImage.id);

    //     });
    //   }),
    //     catchError(
    //       err => {
    //         console.log("Error upload image", err);
    //         throw err;
    //       }
    //     )
    //   )).subscribe(
    //     (res) => {
    //       console.log(res);
    //     }
    //   );
    // });
    // }
    return ImgSaveInfo;
  }

  remove(removedItem: Extended<ImageFile>) {
    return this.beforeImageRemoved(removedItem).then(() => {
      return this.imageService.remove(removedItem.data).then(removeRes => {
        return this.afterImageRemoved(removedItem);
      });
    });
  }
  private beforeImageRemoved(newImage: Extended<ImageFile>) {
    newImage.data.isDelted = true;
    return super.saveOld(newImage);
  }
  private afterImageRemoved(removedItem: Extended<ImageFile>): any {
    super.remove(removedItem);
  }
  private async beforeImageUploaded(key: string, ImgSaveInfo: ImageSaveInfo) {
    const newItem: ImageFile = {
      size: ImgSaveInfo.size,
      height: ImgSaveInfo.height,
      width: ImgSaveInfo.width,
      name: ImgSaveInfo.srcName,
      // thumbWidth: ImgSaveInfo.thumbWidth,
      // thumbHeight: ImgSaveInfo.thumbHeight,
      // thumbSize: ImgSaveInfo.thumbSize

    } as ImageFile;
    const extImage: Extended<ImageFile> = {
      id: key,
      data: newItem
    };
    await super.saveNew(extImage, key);
    return extImage;
  }

  private afterImageUploaded(newImage: Extended<ImageFile>, { url, thumbUrl }) {
    newImage.data = { ...newImage.data, url, thumbUrl, isUploaded: true };
    return super.saveOld(newImage).then(() => this.getOnce(newImage.id));
  }
}
