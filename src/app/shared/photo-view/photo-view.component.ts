import { Component, OnInit, ViewChild } from "@angular/core";
import { ImagesDataService } from "../../providers/StoreData/images-data.service";
import { Extended, ImageFile } from "../../interfaces/data-models";
import { Slides, NavController, NavParams, ModalController } from "@ionic/angular";

@Component({
  selector: "app-photo-view",
  templateUrl: "./photo-view.component.html",
  styleUrls: ["./photo-view.component.scss"]
})
export class PhotoViewComponent implements OnInit {
  images: Extended<ImageFile>[];
  sliderOptions: {initialSlide: number} = {initialSlide: 0};
  canDelete: boolean;
  canRemove: boolean;
  canSelect: boolean;
  @ViewChild(Slides) slider: Slides;
  canUpload: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private imagesFsRepository: ImagesDataService
  ) {
    const startIndex = this.navParams.get("photo_index");
    if (startIndex) {
      this.sliderOptions.initialSlide = startIndex;
    }
    this.images = this.navParams.get("images");
    this.canDelete = this.navParams.get("canDelete");
    this.canRemove = this.navParams.get("canRemove");
    this.canSelect = this.navParams.get("canSelect");
    this.canUpload = this.navParams.get("canUpload");
   // this.imagesFsRepository = this.navParams.get("imagesFsRepository");
  }
  ionViewDidEnter() {
    //   this.slider._rtl = true
   // this.slider.zoom = true;
    console.log("ionViewDidEnter");
  }
  async select() {
    const index = await this.slider.getActiveIndex();
    const extImage = await this.images[index];
    return await this.modalCtrl.dismiss(extImage);
  }
  async upload() {
    const index = await this.slider.getActiveIndex();
    const extImage = await this.images[index];
    return await this.modalCtrl.dismiss(extImage, "upload");
  }
  remove() {
    if (this.canRemove) {
      this.modalCtrl.dismiss("REMOVE");
    }
  }
  async delete() {
    const index = await this.slider.getActiveIndex();
    const extImage = await this.images[index];
    this.imagesFsRepository.remove(extImage).then(() => {
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

  ngOnInit() {
  }
}
