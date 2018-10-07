import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  links = [
    { path: "/UserStores", title: "User Stores" },
    { path: "/home", title: "Home" },
    { path: "/login", title: "login" },
    { path: "/signup", title: "Sign up" },
    { path: "/EditStoreInfo", title: "EditStoreInfo" },
    { path: "/StoreBase", title: "Store base" }
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
