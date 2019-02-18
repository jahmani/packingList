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

  async extendImageSaveInfo(imageSaveInfo: ImageSaveInfo, id, folder) {
    const imageString = imageSaveInfo.imageString;
    imageSaveInfo.ext = this.getFileExtension(imageSaveInfo.srcName);

    imageSaveInfo.size = this.getImageSize(imageSaveInfo.imageString);
    imageSaveInfo = { ...imageSaveInfo, ...this.geRrealImgDimension(imageString) };
    imageSaveInfo.thumbString = await this.generateThumb(
      imageSaveInfo.imageString,
      500,
      500,
      1,
      imageSaveInfo.type
    );
    imageSaveInfo.thumbSize = this.getImageSize(imageSaveInfo.thumbString);

    imageSaveInfo.imageId = id;
    imageSaveInfo.imageRef = this.afStorage.ref(folder).child(id + imageSaveInfo.ext);
    imageSaveInfo.thumbRef = this.afStorage
      .ref(folder)
      .child(id + ".thumb" + imageSaveInfo.ext);
    return imageSaveInfo;
  }

  async upload(imgSaveInfo: ImageSaveInfo, id, folder) {
    // todo: handke other content types
    const metadata = {
      contentType: "image/jpeg"
    };

    const imageTask = imgSaveInfo.imageRef.putString(
      imgSaveInfo.imageString,
      "data_url",
      metadata
    );
    const thumbTask = imgSaveInfo.thumbRef.putString(
      imgSaveInfo.thumbString,
      "data_url"
    );

    return { imageTask, thumbTask };
  }
  private geRrealImgDimension(imgSrc) {
    const i = new Image();
    i.src = imgSrc;
    return {
      width: i.naturalWidth,
      height: i.naturalHeight
    };
  }
  generateThumb(
    img,
    MAX_WIDTH: number = 700,
    MAX_HEIGHT: number = 700,
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
  private generateSquareThumb(
    img,
    MAX_LENGTH: number = 700,
    quality: number = 1,
    callback
  ) {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    const image = new Image();

    image.onload = () => {
      let width = image.width;
      let height = image.height;
      let srcX = 0,
        srcY = 0;
      const srcLength = image.height < image.width ? image.height : image.width;

      if (width > height) {
        if (width > MAX_LENGTH) {
          height *= MAX_LENGTH / width;
          width = MAX_LENGTH;
          srcX = (image.width - image.height) / 2;
        }
      } else {
        if (height > MAX_LENGTH) {
          width *= MAX_LENGTH / height;
          height = MAX_LENGTH;
          srcY = (image.height - image.width) / 2;
        }
      }
      canvas.width = MAX_LENGTH;
      canvas.height = MAX_LENGTH;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        srcX,
        srcY,
        srcLength,
        srcLength,
        0,
        0,
        MAX_LENGTH,
        MAX_LENGTH
      );

      // IMPORTANT: 'jpeg' NOT 'jpg'
      const dataUrl = canvas.toDataURL("image/jpeg", quality);

      callback(dataUrl);
    };
    image.src = img;
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
    image.src = img;
  }

  getImageSize(data_url) {
    const head = "data:image/jpeg;base64,";
    return ((data_url.length - head.length) * 3) / 4 / (1024 * 1024);
  }

  /*
  public xhrLoad(src: string) {
    const xhr = new XMLHttpRequest();

    // Use JSFiddle logo as a sample image to avoid complicating
    // this example with cross-domain issues.
  //  xhr.open("GET", "http://fiddle.jshell.net/img/logo.png", true);
    xhr.open("GET", src, true);

    // Ask for the result as an ArrayBuffer.
    xhr.responseType = "arraybuffer";
    const promise = new Promise<string>((resolve, reject) => {
      xhr.onerror = function(e) {
        reject(e);
      };
      xhr.onload = function(e) {
        // Obtain a blob: URL for the image data.
        const arrayBufferView = new Uint8Array(this.response);
        const  blob = new Blob([arrayBufferView], { type: "image/jpeg" });
        const urlCreator = window.URL; // || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(blob);
        resolve(imageUrl);
       // const img = document.querySelector("#photo");
       // img.src = imageUrl;
      };

      xhr.send();
    });
    return promise;

  }
  */
  /*  private loadImage(url: string): Observable<any> {
    return this.httpClient
      // load the image as a blob
      .get(url, {responseType: 'blob'})
      // create an object url of that blob that we can use in the src attribute
      .map(e => URL.createObjectURL(e))
  }
/*

  fixMIME(src) {
    const img = this;

    // First of all, try to guess the MIME type based on the file extension.
    let mime;
    switch (src.toLowerCase().slice(-4)) {
      case ".bmp":
        mime = "bmp";
        break;
      case ".gif":
        mime = "gif";
        break;
      case ".jpg":
      case "jpeg":
        mime = "jpeg";
        break;
      case ".png":
      case "apng":
        mime = "png";
        break;
      case ".svg":
      case "svgz":
        mime = "svg+xml";
        break;
      case ".tif":
      case "tiff":
        mime = "tiff";
        break;
      default:
        console.log("Unknown file extension: " + src);
        return;
    }
    console.log("Couldn't load " + src + "; retrying as image/" + mime);

    // Attempt to download the image data via an XMLHttpRequest.
    const xhr = new XMLHttpRequest();
    let result;
    xhr.onload = function() {
      if (this.status !== 200) {
        return console.log("FAILED: " + src);
      }
      // Blob > ArrayBuffer: http://stackoverflow.com/a/15981017/4200092
      const reader = new FileReader();
      reader.onload = function() {
        // TypedArray > Base64 text: http://stackoverflow.com/a/12713326/4200092
        const data = String.fromCharCode.apply(null, new Uint8Array(result));
        src = "data:image/" + mime + ";base64," + btoa(data);
      };
      reader.readAsArrayBuffer(this.response);
    };
    xhr.open("get", src, true);
    xhr.responseType = "blob";
    xhr.send();
  }
  */
}
