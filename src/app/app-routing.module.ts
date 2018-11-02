import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'UserStores', loadChildren: './pages/user-stores/user-stores.module#UserStoresPageModule' },
  { path: 'EditStoreInfo/:id', loadChildren: './pages/edit-store-info/edit-store-info.module#EditStoreInfoPageModule' },
  { path: 'EditStoreInfo', loadChildren: './pages/edit-store-info/edit-store-info.module#EditStoreInfoPageModule' },
  { path: 'StoreBase', loadChildren: './StorePages/store-base.module#StoreBasePageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
