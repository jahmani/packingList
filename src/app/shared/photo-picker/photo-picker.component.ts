import { Component, OnInit, forwardRef, ViewChild, ElementRef } from "@angular/core";
import { Extended, ImageFile, ImageSaveInfo } from "../../interfaces/data-models";
import { ModalController } from "@ionic/angular";
import { ImagesDataService } from "../../providers/StoreData/images-data.service";
import { ImageService } from "../../providers/Image/image.service";
import { PhotoViewComponent } from "../photo-view/photo-view.component";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PhotoGalleryPage } from "../../StorePages/photo-gallery/photo-gallery.page";
import { EditPhotoPage } from "../../pages/edit-photo/edit-photo.page";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

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
  @ViewChild("fileInput") fileInput: ElementRef;
  imageSaveInfo: ImageSaveInfo;

  constructor(
    private modalCtrl: ModalController,
    private imagesFsRepository: ImagesDataService,
    private imageService: ImageService
  ) {
    console.log("Hello ImageSelectComponent Component");
  }
  get displayImageSrc() {
    return this.imgFile && this.imgFile.data ? this.imgFile.data.url : this.placeHoldereSrc;
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
  setNewImagrFile(imageUrl: string): void {
    const imgFileId = this.imageService.getImageId(imageUrl);
    if (imgFileId) {
      this.imagesFsRepository.getOnce(imgFileId).then(extImage => {
        this.imgFile = extImage;
      });
    }
  }
  removeImage($event) {
    if (this.imgFile) {
      if (this.imgFile.id !== this.imgFileId) {
        this.imagesFsRepository.remove(this.imgFile);
      }
      this.imgFile = null;
    }
    // this.imgFileId = null;
    this.srcChangeFunction(this.imgFileId);
    this.imageSaveInfo = null;
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
        const extImageFile: Extended<ImageFile> = res.data;
        this.imgFile = extImageFile;
        this.imgFileId = extImageFile.id;
        this.srcChangeFunction(extImageFile.data.url);
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
  registerOnTouched(fn: any): void { }
  setDisabledState?(isDisabled: boolean): void { }


  openNativeFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileInpuChanged2(event) {
    event.stopPropagation();
    const file: File = event.target.files[0];
    // let src: any;
    const url = URL.createObjectURL(file);
    this.showEditImage(url, file.name);
    this.fileInput.nativeElement.value = null;
  }

  async showEditImage(blobURL, srcName) {
    const imgInfo: ImageSaveInfo = { blobURL, srcName } as ImageSaveInfo;
    // this.imageSaveInfo = imgInfo;
    const imgEditor = await this.modalCtrl.create(
      { component: EditPhotoPage, componentProps: { imgInfo } });
    await imgEditor.present();
    const res = await imgEditor.onDidDismiss();
    // .then(((res) => {
    if (res.role === "upload" && res && res.data) {
      const imgMeta = res.data as ImageSaveInfo; // { imageSrcUri: res.data, srcName };
      imgMeta.srcName = srcName;
      this.imageSaveInfo = await this.imagesFsRepository.saveNewImage(imgMeta);
      this.imageSaveInfo.downloadUrl.subscribe(url => {
        this.setNewImagrFile(url);
        this.srcChangeFunction(url);
      });

    }

    // }));

  }


  ngOnInit() { }
}
