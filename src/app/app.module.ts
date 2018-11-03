import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { MenuComponent } from './components/menu/menu.component';
import { AccountsListPage } from './StorePages/accounts-list/accounts-list.page';
import { AccountsListPageModule } from './StorePages/accounts-list/accounts-list.module';
import { ProductsListPage } from './StorePages/products-list/products-list.page';
import { ProductsListPageModule } from './StorePages/products-list/products-list.module';
import { PhotoGalleryPageModule } from './StorePages/photo-gallery/photo-gallery.module';



@NgModule({
  declarations: [AppComponent,  MenuComponent ],
  entryComponents: [AccountsListPage],
  imports: [BrowserModule , IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AccountsListPageModule, ProductsListPageModule, PhotoGalleryPageModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
