import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StoreUsersPage } from './store-users.page';

const routes: Routes = [
  {
    path: '',
    component: StoreUsersPage
  },  { path: "edit/:id", loadChildren: "../edit-store-user/edit-store-user.module#EditStoreUserPageModule" },

];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StoreUsersPage]
})
export class StoreUsersPageModule {}
