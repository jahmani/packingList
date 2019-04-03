import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './providers/routGuards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'StoreBase', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'UserStores', loadChildren: './pages/user-stores/user-stores.module#UserStoresPageModule' , canActivate: [AuthGuard]},
  // { path: 'EditStoreInfo', loadChildren: './pages/edit-store-info/edit-store-info.module#EditStoreInfoPageModule' },
  { path: 'StoreBase', loadChildren: './StorePages/store-base.module#StoreBasePageModule' },
  { path: 'phoneNumberLogin', loadChildren: './phone-number-login/phone-number-login.module#PhoneNumberLoginPageModule' },
  // { path: 'phonenumberlogin', loadChildren: './phone-number-login/phone-number-login.module#PhoneNumberLoginPageModule' },
  { path: 'UserProfile', loadChildren: './pages/user-profile/user-profile.module#UserProfilePageModule', canActivate: [AuthGuard]  },
  // { path: 'ImageEditor', loadChildren: './pages/image-editor/image-editor.module#ImageEditorPageModule' },
  // { path: 'EditPhoto', loadChildren: './pages/edit-photo/edit-photo.module#EditPhotoPageModule' },














];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
