import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoViewComponent } from './photo-view/photo-view.component';
import { IonicModule } from '@ionic/angular';
import { OrderHeaderViewComponent } from './order-header-view/order-header-view.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,

  ],
  declarations: [PhotoViewComponent, OrderHeaderViewComponent],
  entryComponents: [PhotoViewComponent],
  exports: [OrderHeaderViewComponent]
})
export class SharedModule { }
