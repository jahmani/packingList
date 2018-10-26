import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Extended, PLLine } from "../../interfaces/data-models";
import { ModalController } from "@ionic/angular";
import { ImagesDataService } from "../../providers/StoreData/images-data.service";
import { PhotoViewComponent } from "../photo-view/photo-view.component";

@Component({
  selector: "app-packing-row",
  templateUrl: "./packing-row.component.html",
  styleUrls: ["./packing-row.component.scss"]
})
export class PackingRowComponent implements OnInit {
  @Input()
  plLine: Extended<PLLine>;
  @Input()
  index: number;
  @Input()
  isActive: Boolean;
  @Output()
  plLineClicked: EventEmitter<number> = new EventEmitter();
  @Output()
  plLineEditClicked: EventEmitter<Extended<PLLine>> = new EventEmitter();
  @Output()
  plLineCopyClicked: EventEmitter<Extended<PLLine>> = new EventEmitter();

  constructor(
    private modalCtrl: ModalController,
    private imagesRep: ImagesDataService
  ) {
    console.log("Hello PlLineRowComponent Component");
  }
  onPlLineClicked() {
    this.plLineClicked.emit(this.index);
  }
  onPlLineEditClicked($event) {
    $event.stopPropagation();
    this.plLineEditClicked.emit(this.plLine);
  }
  onPlLineCopyClicked($event) {
    $event.stopPropagation();
    this.plLineCopyClicked.emit(this.plLine);
  }
  onImageClicked(event) {
    event.stopPropagation();
    this.imagesRep
      .getByUrl(this.plLine.ext.Product.data.thumbUrl)
      .then(extImage => {
        this.openPhoto(0, [extImage]);
      });
  }
  async openPhoto(index, images) {
    const modal = await this.modalCtrl.create({component: PhotoViewComponent, componentProps: {
      photo_index: index,
      canSelect: false,
      images
    }});
    modal.present();
  }
  ngOnInit() {}
}
