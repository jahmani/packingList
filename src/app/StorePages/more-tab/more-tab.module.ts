import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MoreTabPage } from './more-tab.page';

const routes: Routes = [
  { path: '', component: MoreTabPage },
  { path: "PhotoGallery", loadChildren: "../photo-gallery/photo-gallery.module#PhotoGalleryPageModule" },
  { path: "OrdersList", loadChildren: "../orders-list/orders-list.module#OrdersListPageModule" },
  { path: "OrderView/:id", loadChildren: "../order-view/order-view.module#OrderViewPageModule" },
  // { path: 'UserStores', loadChildren: '../../pages/user-stores/user-stores.module#UserStoresPageModule' },
  { path: 'EditStoreInfo', loadChildren: '../../pages/edit-store-info/edit-store-info.module#EditStoreInfoPageModule' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MoreTabPage]
})
export class MoreTabPageModule { }
