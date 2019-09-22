import { Directive, Input, HostListener } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PhotoViewComponent } from './photo-view/photo-view.component';

@Directive({
  selector: '[appThumbExpand]'
})
export class ThumbExpandDirective {

  @Input('appThumbExpand') urls: string[];
  @HostListener('click', ['$event']) onImageClicked(event) {
    event.stopPropagation();
    this.openPhoto(0, this.urls);
  }
  constructor(private modalCtrl: ModalController) { }

  async openPhoto(index, images) {
    const modal = await this.modalCtrl.create({
      component: PhotoViewComponent, componentProps: {
        photo_index: index,
        canSelect: false,
        images
      }
    });
    modal.present();
  }
}
