import { Component, OnInit, OnDestroy } from "@angular/core";

import { Platform, ModalController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AuthService } from "./providers/Auth/auth.service";
import { ActiveStoreService } from "./providers/AppData/active-store.service";
import { Observable, of, fromEvent } from "rxjs";
import { Extended, User, StoreInfo } from "./interfaces/data-models";
import { UsersService } from "./providers/AppData/users.service";
import { map } from "rxjs/internal/operators/map";
import { switchMap, combineLatest } from "rxjs/operators";
import { StoreInfoService } from "./providers/AppData/store-info.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent implements OnInit, OnDestroy {
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
    private modalCtrl: ModalController
  ) {
    this.initializeApp();

    this.user$ = this.usersService.currentUser;
    //  this.authService.user.pipe(
    //   switchMap(u => {
    //     return u ? this.usersService.get(u.uid) : of(null);
    //   })
    // );
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
        this.router.navigateByUrl("/login");
      } else if ( store ) {
        if (!this.initialAppLoad) {
          this.router.navigateByUrl("/");
          this.initialAppLoad = false;
        }
       } else {
        this.router.navigateByUrl("/UserStores");
        this.initialAppLoad = false;
     }
    });
  }
  ngOnInit() {
    const event = fromEvent(document, 'backbutton');
    this.backbuttonSubscription = event.subscribe(async () => {
        const modal = await this.modalCtrl.getTop();
        if (modal) {
            modal.dismiss();
        }
    });
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
