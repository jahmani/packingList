import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductsListPage } from './products-list.page';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ProductsSlidesPage } from './products-slides.page';
import { ProductsListDataService } from './products-list-data.service';


const routes: Routes = [
  {
    path: '',
    component: ProductsListPage
  },
  {
    path: 'slideView',
    component: ProductsSlidesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProductsListPage, ProductsSlidesPage],
  providers: [ProductsListDataService]
})
export class ProductsListPageModule {}
