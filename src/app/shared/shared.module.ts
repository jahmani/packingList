import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoViewComponent } from './photo-view/photo-view.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,

  ],
  declarations: [PhotoViewComponent],
  entryComponents: [PhotoViewComponent]
})
export class SharedModule { }
