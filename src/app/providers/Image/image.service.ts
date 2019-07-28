import { Injectable } from "@angular/core";
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from "@angular/fire/storage";
import { ImageFile, ImageSaveInfo } from "../../interfaces/data-models";



@Injectable({
  providedIn: "root"
})
export class ImageService {
  constructor(private afStorage: AngularFireStorage) {}

  async remove(image: ImageFile) {
    let imagePromise, thumbPromise;
    if (image.url) {
      imagePromise = this.afStorage.storage.refFromURL(image.url).delete();
    }
    if (image.thumbUrl) {
      thumbPromise = this.afStorage.storage.refFromURL(image.thumbUrl).delete();
    }
    return Promise.all([imagePromise, thumbPromise]);
  }
  getFileExtension(fname) {
    // tslint:disable-next-line:no-bitwise
    const ext = fname.slice((fname.lastIndexOf(".") - 1 >>> 0) + 2);
    return ext ? "." + ext : ext;
  }

  // async extendImageSaveInfo(imageSaveInfo: ImageSaveInfo, id, folder) {
  //   const imageString = imageSaveInfo.imageString;
  //   imageSaveInfo.ext = this.getFileExtension(imageSaveInfo.srcName);

  //   imageSaveInfo.size = this.getImageSize(imageSaveInfo.imageString);
  //   imageSaveInfo = { ...imageSaveInfo, ...this.geRrealImgDimension(imageString) };
  //   imageSaveInfo.thumbString = await this.generateThumb(
  //     imageSaveInfo.imageString,
  //     500,
  //     500,
  //     1,
  //     imageSaveInfo.type
  //   );
  //   imageSaveInfo.thumbSize = this.getImageSize(imageSaveInfo.thumbString);

  //   imageSaveInfo.imageId = id;
  //   imageSaveInfo.imageRef = this.afStorage.ref(folder).child(id + imageSaveInfo.ext);
  //   imageSaveInfo.thumbRef = this.afStorage
  //     .ref(folder)
  //     .child(id + ".thumb" + imageSaveInfo.ext);
  //   return imageSaveInfo;
  // }

  async extendImageSaveInfo(imageSaveInfo: ImageSaveInfo, id, folder: string) {
 //   const imageString = imageSaveInfo.imageString;
    imageSaveInfo.ext = this.getFileExtension(imageSaveInfo.srcName);

 //   imageSaveInfo.size = this.getImageSize(imageSaveInfo.imageString);
  //  imageSaveInfo = { ...imageSaveInfo, ...this.geRrealImgDimension(imageString) };
    // imageSaveInfo.thumbString = await this.generateThumb(
    //   imageSaveInfo.imageString,
    //   500,
    //   500,
    //   1,
    //   imageSaveInfo.type
    // );
    // imageSaveInfo.thumbSize = this.getImageSize(imageSaveInfo.thumbString);

    imageSaveInfo.imageId = id;
    imageSaveInfo.imageRef = this.afStorage.ref("storeImages")
    .child(folder).child("products").child("images").child(id + imageSaveInfo.ext);
    // imageSaveInfo.thumbRef = this.afStorage
    //   .ref(folder)
    //   .child(id + ".thumb" + imageSaveInfo.ext);
    return imageSaveInfo;
  }

  async upload(imgSaveInfo: ImageSaveInfo, id, folder) {
    // todo: handke other content types
    const metadata = {
      contentType: "image/jpeg"
    };

    // https://stackoverflow.com/questions/11876175/how-to-get-a-file-or-blob-from-an-object-url
    const editedBlob = await fetch(imgSaveInfo.editedBlobUrl).then(r => r.blob());
   // URL.revokeObjectURL(imgSaveInfo.editedBlobUrl);
   // const thumbBlob = await fetch(imgSaveInfo.thumbBlobUrl).then(r => r.blob());
   // URL.revokeObjectURL(imgSaveInfo.thumbBlobUrl);


//     const thumbTask = imgSaveInfo.thumbRef.put(
//       thumbBlob,
// //      "data_url",
//       metadata
//     );
   // const imageTask = thumbTask;
    const imageTask = imgSaveInfo.imageRef.put(
      editedBlob,
      // "data_url",
      metadata
    );
    // const imageTask = imgSaveInfo.imageRef.putString(
    //   imgSaveInfo.imageString,
    //   "data_url",
    //   metadata
    // );
    // const thumbTask = imgSaveInfo.thumbRef.putString(
    //   imgSaveInfo.thumbString,
    //   "data_url"
    // );

    return {
      imageTask,
       thumbTask: null };
  }
  // private geRrealImgDimension(imgSrc) {
  //   const i = new Image();
  //   i.src = imgSrc;
  //   return {
  //     width: i.naturalWidth,
  //     height: i.naturalHeight
  //   };
  //   console.warn("WRONG DIMENTIONS @ geRrealImgDimension(imgSrc)");
  // }
  generateThumb(
    img,
    MAX_WIDTH: number = 70,
    MAX_HEIGHT: number = 70,
    quality: number = 1,
    type?: string
  ) {
    return new Promise<string>(resolve => {
      return this.generateThumbCB(
        img,
        MAX_WIDTH,
        MAX_HEIGHT,
        quality,
        resolve,
        type
      );
    });
  }
  getImageId(imageUrl: string) {
    let name: string;
    try {
      name = this.afStorage.storage.refFromURL(imageUrl).name;
      // name = name.replace(".thumbundefined", "");
      // name = name.replace(".thumb", "");
      // remove file extension
      const dotIndex = name.indexOf(".");
      if (dotIndex !== -1) {
      name = name.substring(0, dotIndex);
      }
      return name;
    } catch (err) {
      name = undefined;
    } finally {
      return name;
    }
  }

  private generateThumbCB(
    img,
    MAX_WIDTH: number = 700,
    MAX_HEIGHT: number = 700,
    quality: number = 1,
    callback,
    type?: string
  ) {
    const canvas: any = document.createElement("canvas");
    const image: HTMLImageElement = new Image();

    image.onload = () => {
      let width = image.width;
      let height = image.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0, width, height);

      // IMPORTANT: 'jpeg' NOT 'jpg'
      const dataUrl = canvas.toDataURL(type ? type : "image/jpeg", quality);

      callback(dataUrl);
    };
    // const src = this.sanitizer
    image.src = img;
  }

  getImageSize(data_url) {
    const head = "data:image/jpeg;base64,";
    return ((data_url.length - head.length) * 3) / 4 / (1024 * 1024);
    console.warn("WRONG SIZE ", "getImageSize(data_url)");
  }

}
