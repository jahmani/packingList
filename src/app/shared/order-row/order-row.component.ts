import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Extended, OrderRow } from '../../interfaces/data-models';
import { ModalController } from '@ionic/angular';
import { ImagesDataService } from '../../providers/StoreData/images-data.service';
import { PhotoViewComponent } from '../photo-view/photo-view.component';

@Component({
  selector: 'app-order-row',
  templateUrl: './order-row.component.html',
  styleUrls: ['./order-row.component.scss'],
})
export class OrderRowComponent implements OnInit {
  _expandable = false;
  @Input() set expandable(val: boolean){
    this._expandable = val;
  }
  _expanded = false;

  @Input()
  orderRow: Extended<OrderRow>;
  @Input()
  index: number;
  @Input()
  isActive: Boolean;
  @Output()
  plLineClicked: EventEmitter<number> = new EventEmitter();
  constructor(
    private modalCtrl: ModalController,
    private imagesRep: ImagesDataService
  ) {
    console.log("Hello PlLineRowComponent Component");
  }
  onPlLineClicked() {
    this.plLineClicked.emit(this.index);
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
