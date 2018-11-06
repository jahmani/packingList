import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Extended, OrderRow } from '../../interfaces/data-models';
import { ModalController } from '@ionic/angular';
import { ImagesDataService } from '../../providers/StoreData/images-data.service';
import { PhotoViewComponent } from '../photo-view/photo-view.component';

@Component({
  selector: 'app-order-row',
  templateUrl: './order-row.component.1.html',
  styleUrls: ['./order-row.component.1.scss'],
})
export class OrderRowComponent implements OnInit {
  @Input()
  orderRow: Extended<OrderRow>;
  @Input()
  index: number;
  @Input()
  isActive: Boolean;
  @Output()
  plLineClicked: EventEmitter<number> = new EventEmitter();
  @Output()
  plLineEditClicked: EventEmitter<Extended<OrderRow>> = new EventEmitter();
  @Output()
  plLineCopyClicked: EventEmitter<Extended<OrderRow>> = new EventEmitter();

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
    this.plLineEditClicked.emit(this.orderRow);
  }
  onPlLineCopyClicked($event) {
    $event.stopPropagation();
    this.plLineCopyClicked.emit(this.orderRow);
  }
  onImageClicked(event) {
    event.stopPropagation();
    this.imagesRep
      .getByUrl(this.orderRow.ext.Product.data.thumbUrl)
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
  ngOnInit() {
  }

}
