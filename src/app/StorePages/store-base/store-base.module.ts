import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { StoreBasePage } from "./store-base.page";

const routes: Routes = [
  {
    path: "",
    component: StoreBasePage,
    children: [
      { path: "", redirectTo: "AccountsList", pathMatch: "full" },
      {
        path: "AccountsList",
        loadChildren:
          "../accounts-list/accounts-list.module#AccountsListPageModule"
      },
      {
        path: "EditAccount/:id",
        loadChildren:
          "../edit-account/edit-account.module#EditAccountPageModule"
      },
      {
        path: "AccountTransactionsList/:id",
        loadChildren:
          "../account-transactions-list/account-transactions-list.module#AccountTransactionsListPageModule"
      },
      {
        path: "OrdersList",
        loadChildren: "../orders-list/orders-list.module#OrdersListPageModule"
      },
      {
        path: "ProductsList",
        loadChildren:
          "../products-list/products-list.module#ProductsListPageModule"
      },
      {
        path: "EditOrderHeader/:id",
        loadChildren:
          "../edit-order-header/edit-order-header.module#EditOrderHeaderPageModule"
      },
      {
        path: "OrderView/:id",
        loadChildren: "../order-view/order-view.module#OrderViewPageModule"
      },
      {
        path: "EditOrderLine/:lineId",
        loadChildren:
          "../edit-order-line/edit-order-line.module#EditOrderLinePageModule"
      },
      {
        path: "NewOrderLine/:orderId",
        loadChildren:
          "../edit-order-line/edit-order-line.module#EditOrderLinePageModule"
      }
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
