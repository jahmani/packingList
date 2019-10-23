import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductsListPage } from './products-list.page';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ProductsSlidesPage } from './products-slides.page';
import { ProductsListDataService } from './products-list-data.service';
import { ProductsListModalContainerComponent } from './products-list-modal-container/products-list-modal-container.component';
import { CanDeactivateGuard } from '../../providers/routGuards/can-deactivate.guard';


const routes: Routes = [
  {
    path: '',
    component: ProductsListPage,
    canDeactivate: [CanDeactivateGuard]

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
  declarations: [ProductsListPage, ProductsSlidesPage, ProductsListModalContainerComponent],
  providers: [ProductsListDataService]
})
export class ProductsListPageModule {}
