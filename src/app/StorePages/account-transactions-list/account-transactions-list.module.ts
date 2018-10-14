import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AccountTransactionsListPage } from './account-transactions-list.page';

const routes: Routes = [
  {
    path: '',
    component: AccountTransactionsListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AccountTransactionsListPage]
})
export class AccountTransactionsListPageModule {}
