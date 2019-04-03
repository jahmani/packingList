import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StoreBasePage } from "./store-base/store-base.page";
import { StoreGuardService } from "../providers/routGuards/store-guard.service";

const routes: Routes = [
  {
    path: "",
    component: StoreBasePage,
    canActivateChild: [StoreGuardService],
    children: [
      { path: "", redirectTo: "tabs", pathMatch: "full" },
      {
        path: "AccountsList",
        loadChildren:
          "./accounts-list/accounts-list.module#AccountsListPageModule"
      },
      {
        path: "tabs",
        loadChildren:
          "./tabs/tabs.module#TabsPageModule"
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
        path: "catalog",
        loadChildren:
          "./catalog/catalog2.module#CatalogPageModule"
      },
      {
        path: "EditOrderHeader",
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
      },
      {
        path: "Packinglists",
        loadChildren:
          "./packinglists/packinglists.module#PackinglistsPageModule"
      },
      {
        path: "Packinglist/:id",
        loadChildren:
          "./packinglist/packinglist.module#PackinglistPageModule"
      },
      { path: 'StoreUsers', loadChildren: './store-users/store-users.module#StoreUsersPageModule' },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class StoreBaseRoutingModule {}
