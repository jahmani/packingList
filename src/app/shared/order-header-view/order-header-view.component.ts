import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Extended, Order, StoreInfo } from "../../interfaces/data-models";
import { ImagesDataService } from "../../providers/StoreData/images-data.service";
import { PhotoViewComponent } from "../photo-view/photo-view.component";
import { ActiveStoreService } from "../../providers/AppData/active-store.service";


@Component({
  selector: "app-order-header-view",
  templateUrl: "./order-header-view.component.html",
  styleUrls: ["./order-header-view.component.scss"]
})
export class OrderHeaderViewComponent implements OnInit {
  @Input()
  order: Extended<Order>;
  storeInfo: Extended<StoreInfo>;

  constructor(
    private imagesRep: ImagesDataService,
    private modalCtrl: ModalController,
    ass: ActiveStoreService
  ) {
    this.storeInfo = ass.activeStoreInfoValue;
  }
  onImageClicked(event) {
    event.stopPropagation();
    this.imagesRep.getByUrl(this.order.data.imageUrl).then(extImage => {
      this.openPhoto(0, [extImage]);
    });
  }

  async openPhoto(index, images) {
    const modal = await this.modalCtrl.create({component: PhotoViewComponent, componentProps: {
      photo_index: index,
      canSelect: false,
      images
    }});

    return modal.present();
  }
  ngOnInit() {}
}
