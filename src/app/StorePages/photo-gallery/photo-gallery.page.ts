import {
  Component,
  OnInit,
  Optional,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Observable } from "rxjs";
import { Extended, ImageFile } from "../../interfaces/data-models";
import { NavParams, ModalController } from "@ionic/angular";
import { ViewController } from "@ionic/core";
import { ImageMeta } from "../../providers/Image/image.service";
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
  canGoBack = false;
  galleryType = "slides";
  @ViewChild("fileInput")
  fileInput: ElementRef;

  constructor(
    @Optional() public navParams: NavParams,
    private modalCtrl: ModalController,
    @Optional() private imagesFsRepository: ImagesDataService
  ) {
    // this.canSelect = navParams.get("canSelect");
    // this.canGoBack = navParams.get("canGoBack");

    if (!imagesFsRepository) {
      this.imagesFsRepository = navParams.get("imagesFsRepository");
    }

    this.storeImages = this.imagesFsRepository.List();
    // .pipe(map((extImages=>{
    //  return extImages.map(extImage=>extImage.data)
    // })))
  }

  async openPhoto(index, images) {
    const modal = await this.modalCtrl.create({
      component: PhotoViewComponent,
      componentProps: {
        photo_index: index,
        canSelect: this.canSelect,
        images
      }
    });
    modal.present();
    modal.onDidDismiss().then((extImageFile: Extended<ImageFile>) => {
      this.selectPhoto(extImageFile);
    });
  }

  selectPhoto(image: Extended<ImageFile>) {
    if (image) {
      this.modalCtrl.dismiss(image);
    }
  }
  onClick(index, images): void {
    this.openPhoto(index, images);
  }
  addPhoto() {
    this.fileInput.nativeElement.click();
  }
  onPhotoAdded(event) {
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
        console.log("fileeeeeeeeeeeeeeeeeef", src);
        self.previewPhoto(src);
      };
      fr.readAsDataURL(file);
    }
  }

  previewPhoto(src) {
    const extimg: Partial<Extended<Partial<ImageFile>>> = {};
    extimg.data = { url: src, thumbUrl: src };
    this.openPhoto(0, [extimg]);
  }
  close() {}
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
