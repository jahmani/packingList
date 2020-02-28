import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

// import { AngularCropperjsModule } from 'angular-cropperjs';
import { ImageEditorPage } from './image-editor.page';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';

const routes: Routes = [
  {
    path: '',
    component: ImageEditorPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  //   AngularCropperjsModule
  ],
//  declarations: [ImageEditorPage, ImageCropperComponent ]
})
export class ImageEditorPageModule {}
