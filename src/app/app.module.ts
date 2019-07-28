import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, RouteReuseStrategy, Routes } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../environments/environment";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { MenuComponent } from "./components/menu/menu.component";
import { AccountsListPage } from "./StorePages/accounts-list/accounts-list.page";
import { AccountsListPageModule } from "./StorePages/accounts-list/accounts-list.module";
import { ProductsListPage } from "./StorePages/products-list/products-list.page";
import { ProductsListPageModule } from "./StorePages/products-list/products-list.module";
import { PhotoGalleryPageModule } from "./StorePages/photo-gallery/photo-gallery.module";
import { ServiceWorkerModule } from "@angular/service-worker";
import { EditOrderRowPageModule } from "./StorePages/edit-order-row/edit-order-row.module";
import { EditProductPageModule } from "./StorePages/edit-product/edit-product.module";
import { EditAccountPageModule } from "./StorePages/edit-account/edit-account.module";
import { ProductsPageSettingsComponent } from './products-page-settings/products-page-settings.component';
import { CatigoryCtrlComponent } from './catigory-ctrl/catigory-ctrl.component';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';

@NgModule({

  declarations: [AppComponent, MenuComponent, ProductsPageSettingsComponent, CatigoryCtrlComponent,
     ],
  entryComponents: [AccountsListPage, ProductsPageSettingsComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    // AngularFirestoreModule.(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AccountsListPageModule,
    EditOrderRowPageModule,
    ProductsListPageModule,
    PhotoGalleryPageModule,
    EditProductPageModule,
    EditAccountPageModule,    InternationalPhoneNumberModule,
    ServiceWorkerModule.register("/ngsw-worker.js", {
      enabled: environment.production
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
