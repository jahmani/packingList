import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditOrderHeaderPage } from './edit-order-header.page';
import { SharedModule } from '../../shared/shared.module';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { CanDeactivateGuard } from '../../providers/routGuards/can-deactivate.guard';
const routes: Routes = [
  {
    path: '',
    component: EditOrderHeaderPage,
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    Ionic4DatepickerModule,
    RouterModule.forChild(routes),

    SharedModule,

  ],
  declarations: [EditOrderHeaderPage]
})
export class EditOrderHeaderPageModule {}
