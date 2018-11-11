import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StoreBasePage } from "./store-base/store-base.page";

const routes: Routes = [
  {
    path: "",
    component: StoreBasePage,
    children: [
      { path: "", redirectTo: "AccountsList", pathMatch: "full" },
      {
        path: "AccountsList",
        loadChildren:
          "./accounts-list/accounts-list.module#AccountsListPageModule"
      },
      {
        path: "EditAccount/:id",
        loadChildren: "./edit-account/edit-account.module#EditAccountPageModule"
      },
      {
        path: "AccountTransactionsList/:id",
        loadChildren:
          "./account-transactions-list/account-transactions-list.module#AccountTransactionsListPageModule"
      },
      {
        path: "OrdersList",
        loadChildren: "./orders-list/orders-list.module#OrdersListPageModule"
      },
      {
        path: "ProductsList",
        loadChildren:
          "./products-list/products-list.module#ProductsListPageModule"
      },
      {
        path: "EditOrderHeader/:id",
        loadChildren:
          "./edit-order-header/edit-order-header.module#EditOrderHeaderPageModule"
      },
      {
        path: "OrderView/:id",
        loadChildren: "./order-view/order-view.module#OrderViewPageModule"
      },
      {
        path: "EditOrderRow/:lineId",
        loadChildren:
          "./edit-order-row/edit-order-row.module#EditOrderRowPageModule"
      },
      {
        path: "NewOrderRow/:orderId",
        loadChildren:
          "./edit-order-row/edit-order-row.module#EditOrderRowPageModule"
      },
      {
        path: "EditProduct/:id",
        loadChildren: "./edit-product/edit-product.module#EditProductPageModule"
      },
      {
        path: "PhotoGallery",
        loadChildren:
          "./photo-gallery/photo-gallery.module#PhotoGalleryPageModule"
      },
      {
        path: "EditPackingListInfo/:id",
        loadChildren:
          "./edit-packinglist-info/edit-packinglist-info.module#EditPackinglistInfoPageModule"
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
})
export class StoreBaseRoutingModule {}
