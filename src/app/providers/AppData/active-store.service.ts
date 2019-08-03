import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, merge } from "rxjs";
import { take, map, skip, switchMap, tap } from "rxjs/operators";
import { AuthService } from "../Auth/auth.service";
// import { UserStoresService } from "./user-stores.service";
import { StoreInfoService } from "./store-info.service";
import { Extended, StoreInfo } from "../../interfaces/data-models";

@Injectable({
  providedIn: "root"
})
export class ActiveStoreService {
  private subject: BehaviorSubject<string>;

  private userChangedActiveStoreKey$: Observable<string>;
  private initialDefaultLocalStoreKey: Observable<string>;
  activeStoreKey$: Observable<string>;
  activeStoreInfo: Observable<Extended<StoreInfo>>;
  activeStoreInfoValue: Extended<StoreInfo>;

  constructor(
    // private userStoresService: UserStoresService,
    private storesInfoService: StoreInfoService,
    private authService: AuthService
  ) {
    this.initialDefaultLocalStoreKey = this.authService.user.pipe(
    map(user => user ? window.localStorage.getItem(`${user.uid}DEFAULT_STORE`) : null));
    this.subject = new BehaviorSubject(null);
    this.userChangedActiveStoreKey$ = this.subject.asObservable().pipe(skip(1));
    this.activeStoreKey$ = merge(this.userChangedActiveStoreKey$, this.initialDefaultLocalStoreKey);
    this.activeStoreInfo = this.activeStoreKey$.pipe(switchMap((key) => this.storesInfoService.get(key)));
    this.activeStoreInfo.subscribe((exStoreInfo) => {
      this.activeStoreInfoValue = exStoreInfo;
    });
  }

  getlatest() {
    return this.activeStoreKey$.pipe(take(1)).toPromise();
  }

  private async setDefaultStoreKey(newKey) {
    const user = await this.authService.getUser();
    window.localStorage.setItem(`${user.uid}DEFAULT_STORE`, newKey);
  }

  async setActiveStoreKey(newKey) {
    const currentKey = await this.getlatest();
    if (newKey !== currentKey) {
      await this.setDefaultStoreKey(newKey);
      this.subject.next(newKey);
    }
  }
}
