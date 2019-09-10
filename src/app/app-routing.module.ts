import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './providers/routGuards/auth.guard';
import { RoleGuardService } from './providers/routGuards/role-guard.service';

const routes: Routes = [
  {
    path: 'products',
    children: [
      {
        path: '',
        loadChildren: './StorePages/products-list/products-list.module#ProductsListPageModule',
        canActivate: [RoleGuardService]
      }
    ]
  },
  {
    path: "EditProduct/:id",
    loadChildren: "./StorePages/edit-product/edit-product.module#EditProductPageModule"
  },
  { path: '', redirectTo: 'StoreBase/ProductsList', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'UserStores', loadChildren: './pages/user-stores/user-stores.module#UserStoresPageModule' , canActivate: [AuthGuard]},
  { path: 'EditStoreInfo', loadChildren: './pages/edit-store-info/edit-store-info.module#EditStoreInfoPageModule' },
  { path: 'StoreBase', loadChildren: './StorePages/store-base.module#StoreBasePageModule' },
  { path: 'phoneNumberLogin', loadChildren: './phone-number-login/phone-number-login.module#PhoneNumberLoginPageModule' },
  // { path: 'phonenumberlogin', loadChildren: './phone-number-login/phone-number-login.module#PhoneNumberLoginPageModule' },
  { path: 'UserProfile', loadChildren: './pages/user-profile/user-profile.module#UserProfilePageModule', canActivate: [AuthGuard]  },
  { path: 'EditStoreUser', loadChildren: './StorePages/edit-store-user/edit-store-user.module#EditStoreUserPageModule' },
  { path: 'Share', loadChildren: './pages/share/share.module#SharePageModule' },


  // { path: 'ImageEditor', loadChildren: './pages/image-editor/image-editor.module#ImageEditorPageModule' },
  // { path: 'EditPhoto', loadChildren: './pages/edit-photo/edit-photo.module#EditPhotoPageModule' },














];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
