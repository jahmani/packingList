import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { RoleGuardService } from '../../providers/routGuards/role-guard.service';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'products',
        children: [
          {
            path: '',
            loadChildren: '../products-list/products-list.module#ProductsListPageModule',
            canActivate: [RoleGuardService]
          }
        ]
      },
      {
        path: 'suppliers',
        children: [
          {
            path: '',
            loadChildren: '../accounts-list/accounts-list.module#AccountsListPageModule'
          }
        ]
      },
      {
        path: 'pls',
        children: [
          {
            path: '',
            loadChildren: '../packinglists/packinglists.module#PackinglistsPageModule'
          }
        ]
      }, {
        path: 'more',
        children: [
          {
            path: '',
            loadChildren: '../more-tab/more-tab.module#MoreTabPageModule'
          }
        ]
      },

      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
