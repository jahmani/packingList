import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditOrderRowPage } from './edit-order-row.page';
import { SharedModule } from '../../shared/shared.module';
import { PackingLineEditorComponent } from './packing-line-editor/packing-line-editor.component';

const routes: Routes = [
  {
    path: '',
    component: EditOrderRowPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [EditOrderRowPage, PackingLineEditorComponent]
})
export class EditOrderRowPageModule {}
