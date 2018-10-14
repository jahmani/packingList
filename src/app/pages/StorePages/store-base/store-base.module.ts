import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { StoreBasePage } from "./store-base.page";
import { AccountsDataService } from "../../providers/StoreData/accounts-data.service";

const routes: Routes = [
  {
    path: "",
    component: StoreBasePage,
    children: [
      { path: "", redirectTo: "AccountsList", pathMatch: "full" },
      {
        path: "AccountsList",
        loadChildren:
          "../StorePages/accounts-list/accounts-list.module#AccountsListPageModule"
      },
      {
        path: "AccountTransactionsList/:id",
        loadChildren:
          "../StorePages/account-transactions-list/account-transactions-list.module#AccountTransactionsListPageModule"
      },
      {
        path: "EditAccount/:id",
        loadChildren:
          "../StorePages/edit-account/edit-account.module#EditAccountPageModule"
      },
      { path: 'OrdersList', loadChildren: '../StorePages/orders-list/orders-list.module#OrdersListPageModule' },

    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StoreBasePage]
})
export class StoreBasePageModule {}
