import { Component, OnInit, ViewChild } from "@angular/core";
import { ImagesDataService } from "../../providers/StoreData/images-data.service";
import { Extended, ImageFile } from "../../interfaces/data-models";
import { Slides, NavController, NavParams, ModalController } from "@ionic/angular";
import { ViewController } from "@ionic/core";

@Component({
  selector: "app-photo-view",
  templateUrl: "./photo-view.component.html",
  styleUrls: ["./photo-view.component.scss"]
})
export class PhotoViewComponent implements OnInit {
  private imagesFsRepository: ImagesDataService;
  images: Extended<ImageFile>[];
  open_at_index: any = 0;
  canDelete: boolean;
  canRemove: boolean;
  canSelect: boolean;
  @ViewChild(Slides) slider: Slides;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController
  ) {
    this.open_at_index = this.navParams.get("photo_index");
    this.images = this.navParams.get("images");
    this.canDelete = this.navParams.get("canDelete");
    this.canRemove = this.navParams.get("canRemove");
    this.canSelect = this.navParams.get("canSelect");
    this.imagesFsRepository = this.navParams.get("imagesFsRepository");
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
  remove() {
    if (this.canRemove) {
      this.modalCtrl.dismiss({ action: "REMOVE" });
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

  ngOnInit() {}
}
