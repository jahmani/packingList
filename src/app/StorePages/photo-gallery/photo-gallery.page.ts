import {
  Component,
  OnInit,
  Optional,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Observable } from "rxjs";
import {
  Extended,
  ImageFile,
  OpenPhotoRules,
  ImageSaveInfo
} from "../../interfaces/data-models";
import { NavParams, ModalController } from "@ionic/angular";
import { ViewController } from "@ionic/core";
import { ImageService } from "../../providers/Image/image.service";
import { ImagesDataService } from "../../providers/StoreData/images-data.service";
import { PhotoViewComponent } from "../../shared/photo-view/photo-view.component";

@Component({
  selector: "app-photo-gallery",
  templateUrl: "./photo-gallery.page.html",
  styleUrls: ["./photo-gallery.page.scss"]
})
export class PhotoGalleryPage implements OnInit {
  storeImages: Observable<Extended<ImageFile>[]>;
  canSelect = false;
  canGoBack = true;
  galleryType = "slides";
  @ViewChild("fileInput")
  fileInput: ElementRef;
  testImage;

  constructor(
    @Optional() public navParams: NavParams,
    private modalCtrl: ModalController,
    @Optional() private imagesFsRepository: ImagesDataService,
    private imagesService: ImageService
  ) {
    // this.canSelect = navParams.get("canSelect");
    // this.canGoBack = navParams.get("canGoBack");

    if (!imagesFsRepository) {
      this.imagesFsRepository = navParams.get("imagesFsRepository");
    }

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
 trackByFn(index, extImage: Extended<ImageFile>) {
  return extImage.id; // or item.id
}
  async openPhoto(index, images, rules?: OpenPhotoRules) {
    const modal = await this.modalCtrl.create({
      component: PhotoViewComponent,
      componentProps: {
        photo_index: index,
        canGoBack: this.canGoBack,
        images,
        ...rules
      }
    });
    modal.present();
    modal.onDidDismiss().then(res => {
      if (res && res.data) {
        const extImageFile: Partial<Extended<ImageFile>> = {};
        extImageFile.data = res.data.data;
        if (res.role === "upload") {
          const imgMeta: Partial<ImageSaveInfo> =  {imageString: extImageFile.data.url};
          this.imagesFsRepository.saveNewImage(extImageFile.data.url);
        } else {
          this.selectPhoto(extImageFile);
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
    this.openPhoto(index, images, { canSelect: this.canSelect , canDelete: true });
  }
  openNativeFileInput() {
    this.fileInput.nativeElement.click();
  }
  onFileInpuChanged(event) {
    event.stopPropagation();
    this.preview(event);
  }
  preview($event) {
    const image: any = new Image();
    const file: File = $event.target.files[0];
    let src: any;
    const self = this;
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = function() {
        src = fr.result;
        // console.log("fileeeeeeeeeeeeeeeeeef", src);
        self.previewPhoto(src);
      };
      fr.readAsDataURL(file);
    }
  }
  previewPhoto(src) {
    const extimg = {ext: {}} as Extended<ImageFile>;
    extimg.data = { url: src, thumbUrl: src } as ImageFile;
    this.openPhoto(0, [extimg], { canUpload: true });
  }

  close() {
    this.modalCtrl.dismiss();
  }
  AddNewImage() {
    // this.navCtrl.p
    /*
    const newImageModal = this.modalCtrl.create("ImageCropperPage");
    newImageModal.present();
    newImageModal.onDidDismiss(res => {
      console.log(res);
      const imgData: ImageMeta = res.imageData;
      this.imagesFsRepository.saveNewImage(imgData);
    });
    */
  }
  ngOnInit() {}
}
