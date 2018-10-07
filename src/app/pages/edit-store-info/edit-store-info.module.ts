import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditStoreInfoPage } from './edit-store-info.page';

const routes: Routes = [
  {
    path: '',
    component: EditStoreInfoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditStoreInfoPage]
})
export class EditStoreInfoPageModule {}
