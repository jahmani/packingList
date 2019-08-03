import { Component, OnDestroy } from "@angular/core";

import { Platform, ToastController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AuthService } from "./providers/Auth/auth.service";
import { ActiveStoreService } from "./providers/AppData/active-store.service";
import { Observable, of } from "rxjs";
import { Extended, User, StoreInfo } from "./interfaces/data-models";
import { UsersService } from "./providers/AppData/users.service";
import { switchMap, combineLatest, tap } from "rxjs/operators";
import { StoreInfoService } from "./providers/AppData/store-info.service";
import { Router } from "@angular/router";
import { SwUpdate } from "@angular/service-worker";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent implements OnDestroy {
  user$: Observable<Extended<User>>;
  activeStore$: Observable<Extended<StoreInfo>>;
  backbuttonSubscription: any;
  initialAppLoad = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private usersService: UsersService,
    private storesService: StoreInfoService,
    private activeStoreService: ActiveStoreService,
    private router: Router,
    private toastController: ToastController,
    private swUpdate: SwUpdate
  ) {
    this.initializeApp();

    this.user$ = this.usersService.currentUser.pipe(tap(u => {
      console.log(u);
    }));
    this.swUpdate.checkForUpdate();
    this.swUpdate.available.subscribe(evt => {
      this.presentToastWithOptions();
    });

    this.activeStore$ = this.activeStoreService.activeStoreKey$.pipe(
      switchMap(storeId => {
        if (storeId) {
          return this.storesService.get(storeId);
        } else {
          return of(null);
        }
      })
    );

    this.authService.user.pipe(combineLatest(this.activeStore$)).subscribe(([user, store]) => {
      if (!user) {
        // this.location.
        this.router.navigateByUrl("/login", { replaceUrl: true });
      } else if (store) {
        // if (this.initialAppLoad) {
        if (true) {
            this.router.navigateByUrl("StoreBase/ProductsList", { replaceUrl: true });
          this.initialAppLoad = false;
        }
      } else {
        this.router.navigateByUrl("/UserStores");
        this.initialAppLoad = false;
      }
    });
  }
  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'New Update',
      message: 'Click to install Update',
      position: 'top',
     // duration: 1000,
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'update',
          handler: () => {
            window.location.reload();
            console.log('update clicked');
          }
        }, {
          text: 'cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }
  ngOnDestroy() {
    this.backbuttonSubscription.unsubscribe();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

}
