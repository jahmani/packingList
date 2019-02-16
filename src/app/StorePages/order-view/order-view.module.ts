import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderViewPage } from './order-view.page';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: OrderViewPage
  },
  { path: "EditOrderHeader", loadChildren: "../edit-order-header/edit-order-header.module#EditOrderHeaderPageModule" },
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [OrderViewPage]
})
export class OrderViewPageModule {}
