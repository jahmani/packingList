import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { ImageFile } from "../../interfaces/data-models";

export interface ImageMeta {
  imageString: string;
  thumbString: string;
  imageUri: string;
  thumbUri: string;
  imageId: string;
  width: number;
  height: number;
  type: string;
  ext: string;
  size: number;
  thumbSize: number;
}

@Injectable({
  providedIn: "root"
})
export class ImageService {
  constructor(private afStorage: AngularFireStorage) {}

  async remove(image: ImageFile) {
    const imageRef = this.afStorage.storage.refFromURL(image.url);
    const thumbRef = this.afStorage.storage.refFromURL(image.thumbUrl);
    return Promise.all([imageRef.delete(), thumbRef.delete()]);
  }
  async upload(imgMeta: Partial<ImageMeta>, id, folder) {
    if (!imgMeta.size) {
      imgMeta.size = this.getImageSize(imgMeta.imageString);
    }
    if (!imgMeta.thumbString) {
      imgMeta.thumbString = await this.generateThumb(
        imgMeta.imageString,
        500,
        500,
        1,
        imgMeta.type
      );
      imgMeta.thumbSize = this.getImageSize(imgMeta.thumbString);
    }
    let randomId = Math.random()
      .toString(36)
      .substring(2);
    randomId = id ? id : randomId;
    imgMeta.imageId = randomId;
    const ref = this.afStorage.ref(folder).child(randomId + imgMeta.ext);
    const thumbRef = this.afStorage
      .ref(folder)
      .child(randomId + ".thumb" + imgMeta.ext);
    const imageTask = ref.putString(imgMeta.imageString, "data_url");
    const thumbTask = thumbRef.putString(imgMeta.thumbString, "data_url");
    const completed = Promise.all([imageTask, thumbTask]);
    imageTask.then(a => {
      console.log("Done imageTask");
      imgMeta.imageUri = a.downloadURL;
    });
    thumbTask.then(a => {
      console.log("Done thumbTask");

      imgMeta.thumbUri = a.downloadURL;
    });
    completed.then(() => console.log("Done uploaDING"));
    return { imgMeta, imageTask, thumbTask };
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
      name = name.replace(".thumb", "");
      const dotIndex = name.lastIndexOf(".");
      name = name.substring(0, dotIndex);
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
}
