import { Component, OnInit, ViewChild } from "@angular/core";
import { ImagesDataService } from "../../providers/StoreData/images-data.service";
import { Extended, ImageFile } from "../../interfaces/data-models";
import { NavParams, ModalController, IonSlides } from "@ionic/angular";
// import { ImageEditorPage } from "../../pages/image-editor/image-editor.page";
// import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-photo-view",
  templateUrl: "./photo-view.component.html",
  styleUrls: ["./photo-view.component.scss"]
})
export class PhotoViewComponent implements OnInit {
  images: Extended<ImageFile>[];
  sliderOptions: { initialSlide: number } = { initialSlide: 0 };
  canDelete: boolean;
  canRemove: boolean;
  canSelect: boolean;
  @ViewChild(IonSlides) slider: IonSlides;
  deleteInProgress: boolean;
  constructor(
    // private navCtrl: NavController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private imagesFsRepository: ImagesDataService,
    // private sanitizer: DomSanitizer

  ) {
    const startIndex = this.navParams.get("photo_index");
    if (startIndex) {
      this.sliderOptions.initialSlide = startIndex;
    }
    this.images = this.navParams.get("images");
    this.canDelete = this.navParams.get("canDelete");
    this.canRemove = this.navParams.get("canRemove");
    this.canSelect = this.navParams.get("canSelect");
    // this.imagesFsRepository = this.navParams.get("imagesFsRepository");
  }
  // sanitize(url) {
  //   return this.sanitizer.bypassSecurityTrustUrl(url);
  // }
  async select() {
    const index = await this.slider.getActiveIndex();
    const extImage = await this.images[index];
    return await this.modalCtrl.dismiss(extImage);
  }
  remove() {
    if (this.canRemove) {
      this.modalCtrl.dismiss("REMOVE");
    }
  }
  async delete() {
    const index = await this.slider.getActiveIndex();
    const extImage = this.images[index];
    this.deleteInProgress = true;
    this.imagesFsRepository.remove(extImage).then(() => {
      this.deleteInProgress = false;
      if (this.images.length === 1) {
        this.close();
      } else if (index !== 0) {
        this.slider.slidePrev();
      } else {
        this.slider.slideNext();
      }
    });
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad PhotoDetailPage");
  }
  close() {
    this.modalCtrl.dismiss();
  }
  // async showEditImage() {
  //   const index = await this.slider.getActiveIndex();
  //   const extImage = await this.images[index];
  //   const imgEditor = await this.modalCtrl.create({ component: ImageEditorPage, componentProps: { imageUrl: extImage.data.url } });
  //   await imgEditor.present();
  //   imgEditor.onDidDismiss().then(((res) => {
  //     if (res && res.data) {
  //       console.log("EditorResults: ", res.data);
  //       extImage.data.url = res.data;
  //       extImage.data.thumbUrl = res.data;
  //     }
  //   }));

  // }
  ngOnInit() {
  }
}
