import {
  Component,
  OnInit,
  Optional,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Observable } from "rxjs";
import {
  Extended,
  ImageFile,
  OpenPhotoRules,
  ImageSaveInfo
} from "../../interfaces/data-models";
import {
   NavParams,
   ModalController } from "@ionic/angular";
// import { ViewController } from "@ionic/core";
// import { ImageService } from "../../providers/Image/image.service";
import { ImagesDataService } from "../../providers/StoreData/images-data.service";
import { PhotoViewComponent } from "../../shared/photo-view/photo-view.component";
// import { ImageEditorPage } from "../../pages/image-editor/image-editor.page";
// import { DomSanitizer } from "@angular/platform-browser";
import { PhotoUploadComponent } from "../../shared/photo-upload/photo-upload.component";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
// import * as  exifStripper from "exif-stripper";

@Component({
  selector: "app-photo-gallery",
  templateUrl: "./photo-gallery.page.html",
  styleUrls: ["./photo-gallery.page.scss"]
})
export class PhotoGalleryPage implements OnInit {
  storeImages: Observable<Extended<ImageFile>[]>;
  canSelect = false;
  // canGoBack = true;
  // galleryType = "slides";
  @ViewChild("fileInput") fileInput: ElementRef;
  // src;
  // testImage;
  // uploadedImageURL: any;

  constructor(
    @Optional() private navParams: NavParams,
    private modalCtrl: ModalController,
    private imagesFsRepository: ImagesDataService,
  //  private imagesService: ImageService,
  //  private sanitizer: DomSanitizer

  ) {
    if (this.navParams) {
      this.canSelect = navParams.get("canSelect") ;
    }
    // this.canGoBack = navParams.get("canGoBack");

    // if (!imagesFsRepository) {
    //   this.imagesFsRepository = navParams.get("imagesFsRepository");
    // }

    this.storeImages = this.imagesFsRepository.extendedList;
    // .pipe(map((extImages=>{
    //  return extImages.map(extImage=>extImage.data)
    // })))
  }
  /*
  private loadPhotoAsBlob(src) {
    const blob = this.imagesService.xhrLoad(src).then(blb => {
      console.log("Loaded Blob");
      return blb;
    });
    return blob;
  }
  */
  trackByFn(extImage: Extended<ImageFile>) {
    return extImage.id; // or item.id
  }
  async openPhoto(index, images: Extended<ImageFile>[], rules?: OpenPhotoRules) {
    const modal = await this.modalCtrl.create({
      component: PhotoViewComponent,
      componentProps: {
        photo_index: index,
//        canGoBack: this.canGoBack,
        images,
        ...rules
      }
    });
    modal.present();
    modal.onDidDismiss().then(res => {
      if (res && res.data) {
        const extImageFile: Partial<Extended<ImageFile>> = res.data;
        // extImageFile = res.data;
        if (res.role === "upload") {
          const imgMeta = { imageString: extImageFile.data.url, srcName: extImageFile.data.name } as ImageSaveInfo;
          this.imagesFsRepository.saveNewImage(imgMeta);
        } else {
          this.selectPhoto(extImageFile);
        }
      }
    });
  }
  async openUploadPhoto(imageString, srcName) {
    const imgInfo: ImageSaveInfo = { imageString, srcName } as ImageSaveInfo;
    const modal = await this.modalCtrl.create({
      component: PhotoUploadComponent,
      componentProps: {
        imgInfo
      }
    });
    modal.present();
    modal.onDidDismiss().then(res => {
      if (res && res.data) {
        const extImageFile: Partial<Extended<ImageFile>> = res.data;
        // extImageFile = res.data;
        if (res.role === "upload") {
          const imgMeta = res.data as ImageSaveInfo; // { imageSrcUri: res.data, srcName };
          imgMeta.srcName = srcName;
          this.imagesFsRepository.saveNewImage(imgMeta);
        }
      }
    });
  }

  selectPhoto(image: Partial<Extended<ImageFile>>) {
    if (image) {
      this.modalCtrl.dismiss(image);
    }
  }
  onClick(index, images): void {
    this.openPhoto(index, images, { canSelect: this.canSelect, canDelete: true });
  }
  openNativeFileInput() {
    this.fileInput.nativeElement.click();
  }
  onFileInpuChanged(event) {
    event.stopPropagation();
    const file: File = event.target.files[0];
    let src: any;

    const self = this;
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = function () {
        src = fr.result;
        // self.src = src;
        // console.log("fileeeeeeeeeeeeeeeeeef", src);
        //  self.previewPhoto(src, file.name);
        self.openUploadPhoto(src, name);
        self.fileInput.nativeElement.value = null;
      };
      fr.readAsDataURL(file);
    }
  }

  // onFileInpuChanged2(event) {
  //   event.stopPropagation();
  //   // Import image

  //   if (URL) {
  //     const files = event.target.files;
  //     let file;

  //     if (files && files.length) {
  //       file = files[0];

  //       if (/^image\/\w+/.test(file.type)) {
  //         const uploadedImageType = file.type;
  //         const uploadedImageName = file.name;

  //         if (this.uploadedImageURL) {
  //           URL.revokeObjectURL(this.uploadedImageURL);
  //         }
  //         this.uploadedImageURL = URL.createObjectURL(file);
  //         const safeUrl = this.sanitize(this.uploadedImageURL);

  //         const extimg = { ext: {} } as Extended<ImageFile>;
  //         extimg.data = { url: safeUrl, thumbUrl: safeUrl, name: uploadedImageName } as ImageFile;
  //         this.openPhoto(0, [extimg], { canUpload: true });
  //         // this.fileInput.nativeElement.value = null;
  //       } else {
  //         window.alert('Please choose an image file.');
  //       }
  //     }
  //   } else {
  //     throw new Error("URL unsupprted browser, 'URL' API not supported");
  //   }

  // }
  // sanitize(url: string) {
  //   return this.sanitizer.bypassSecurityTrustUrl(url);
  // }

  // preview($event) {

  // }
  // previewPhoto(src, name: string) {
  //   const extimg = { ext: {} } as Extended<ImageFile>;
  //   extimg.data = { url: src, thumbUrl: src, name } as ImageFile;
  //   this.openUploadPhoto(src, name);
  // }

  close() {
    this.modalCtrl.dismiss();
  }

  // AddNewImage() {
  //   // this.navCtrl.p
  //   /*
  //   const newImageModal = this.modalCtrl.create("ImageCropperPage");
  //   newImageModal.present();
  //   newImageModal.onDidDismiss(res => {
  //     console.log(res);
  //     const imgData: ImageMeta = res.imageData;
  //     this.imagesFsRepository.saveNewImage(imgData);
  //   });
  //   */
  // }
  ngOnInit() { }
}
