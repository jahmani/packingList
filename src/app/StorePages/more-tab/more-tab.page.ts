import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../providers/Auth/auth.service';
import { UsersService } from '../../providers/AppData/users.service';
import { StoreInfoService } from '../../providers/AppData/store-info.service';
import { ActiveStoreService } from '../../providers/AppData/active-store.service';
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Extended, StoreInfo } from '../../interfaces/data-models';
import { User } from 'firebase';

@Component({
  selector: 'app-more-tab',
  templateUrl: './more-tab.page.html',
  styleUrls: ['./more-tab.page.scss'],
})
export class MoreTabPage implements OnInit {

  storeLinks = [
    { path: "OrdersList", title: "Orders List" },
    { path: "PhotoGallery", title: "Photo Gallery" },
    { path: "StoreUsers", title: "StoreUsers" },
  ];

  userLinks = [
    { path: "UserStores", title: "User Stores" },
    //  { path: "/logout", title: "LogOut", logOut: true },
  ];
  user$: Observable<Extended<User>>;
  activeStore$: Observable<Extended<StoreInfo>>;
  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private usersService: UsersService,
    private storesService: StoreInfoService,
    private activeStoreService: ActiveStoreService,
    public router: Router
  ) {
    this.user$ = this.authService.user.pipe(
      switchMap(u => {
        return u ? this.usersService.get(u.uid) : of(null);
      })
    );
    this.activeStore$ = this.activeStoreService.activeStoreKey$.pipe(
      switchMap(storeId => {
        return this.storesService.get(storeId);
      })
    );

  }
  open(path: string) {
    this.router.navigateByUrl(this.router.url + '/' + path);
  }
  openAbsolute(path: string) {
    this.router.navigateByUrl('/' + path);
  }
  ngOnInit() {
  }
  onLogOut() {
    this.authService.signOut();
  }


}
