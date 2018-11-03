import { Component, OnInit, forwardRef } from "@angular/core";
import { Extended, ImageFile } from "../../interfaces/data-models";
import { ModalController } from "@ionic/angular";
import { ImagesDataService } from "../../providers/StoreData/images-data.service";
import { ImageService } from "../../providers/Image/image.service";
import { PhotoViewComponent } from "../photo-view/photo-view.component";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PhotoGalleryPage } from "../../StorePages/photo-gallery/photo-gallery.page";

@Component({
  selector: "app-photo-picker",
  templateUrl: "./photo-picker.component.html",
  styleUrls: ["./photo-picker.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhotoPickerComponent),
      multi: true
    }
  ]
})
export class PhotoPickerComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private imagesFsRepository: ImagesDataService,
    private imageService: ImageService
  ) {
    console.log("Hello ImageSelectComponent Component");
  }
  get displayImageSrc() {
    return this.imgFile ? this.imgFile.data.thumbUrl : this.placeHoldereSrc;
  }
  srcChangeFunction: any;
  imgFileId: string;
  imgFile: Extended<ImageFile>;
  placeHoldereSrc = "../../assets/icon/attachImage.png";
  writeValue(imageUrl: string): void {
    this.imgFileId = this.imageService.getImageId(imageUrl);
    if (this.imgFileId) {
      this.imagesFsRepository.getOnce(this.imgFileId).then(extImage => {
        this.imgFile = extImage;
      });
    }
  }
  removeImage($event) {
    this.imgFile = null;
    this.imgFileId = null;
    this.srcChangeFunction(this.imgFileId);
  }
  async selectImage($event?) {
    /*    */

    const modal = await this.modalCtrl.create({
      component: PhotoGalleryPage,
      componentProps: {
        canSelect: true,
        canGoBack: true
      }
    });

    modal.present();
    modal.onDidDismiss().then((res) => {
      if (res && res.data) {
        const extImageFile: Extended<ImageFile> = res.data.data;
        this.imgFile = extImageFile;
        this.imgFileId = extImageFile.id;
        this.srcChangeFunction(extImageFile.data.thumbUrl);
      }
    });
  }
  imageClicked($event) {
    $event.stopPropagation();

    // if already have image
    if (this.imgFile) {
      this.openPhoto(0, [this.imgFile]);
    } else {
      this.selectImage();
    }
  }
  async openPhoto(index, images) {
    const modal = await this.modalCtrl.create({
      component: PhotoViewComponent,
      componentProps: {
        photo_index: index,
        canRemove: true,
        images
      }
    });
    modal.onDidDismiss().then((res) => {
      if (res && res.data === "REMOVE") {
        this.removeImage(undefined);
      }
    });
    modal.present();
  }
  registerOnChange(fn: any): void {
    this.srcChangeFunction = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  ngOnInit() {}
}
