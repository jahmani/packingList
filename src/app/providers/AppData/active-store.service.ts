import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, merge } from "rxjs";
import { take, map, skip, switchMap } from "rxjs/operators";
import { AuthService } from "../Auth/auth.service";
import { UserStoresService } from "./user-stores.service";
// import { UserStoresService } from "./user-stores.service";

@Injectable({
  providedIn: "root"
})
export class ActiveStoreService {
  private subject: BehaviorSubject<string>;

  // private _activeStoreKey = null; // "HW1TAwI2hz0pLNINa51Q";
  userChangedActiveStoreKey$: Observable<string>;
  initialDefaultLocalStoreKey: Observable<string>;
  activeStoreKey$: Observable<string>;
  // latestStoreKey: Promise<string>;
  constructor(
    private userStoresService: UserStoresService,
    private authService: AuthService
  ) {
    this.initialDefaultLocalStoreKey = this.authService.user.pipe(
      map(user => user ? window.localStorage.getItem(`${user.uid}DEFAULT_STORE`) : null));

    //  const defaultk = this.defaultLocalStoreKey();
    // this._activeStoreKey = defaultk;  // || "HW1TAwI2hz0pLNINa51Q";
    this.subject = new BehaviorSubject(null);
    this.userChangedActiveStoreKey$ = this.subject.asObservable().pipe(skip(1));
    this.activeStoreKey$ = merge(this.userChangedActiveStoreKey$, this.initialDefaultLocalStoreKey);
    // this.latestStoreKey =
  }
  // private get activeStoreKey() {
  //   return this._activeStoreKey;
  // }
  // get activeStoreKey$() {
  //   return this._activeStoreKey$;
  // }
  getlatest() {
    return this.activeStoreKey$.pipe(take(1)).toPromise();
  }
  getActiveStoreInfo() {
    return this.activeStoreKey$.pipe(switchMap((key) => this.userStoresService.get(key)));
  }
  // public getReactivePath(subPath: string) {

  // }
  private async setDefaultStoreKey(newKey) {
    const user = await this.authService.getUser();
    window.localStorage.setItem(`${user.uid}DEFAULT_STORE`, newKey);
  }
  // private async getDefaultStoreKey() {
  //   const user = await this.authService.getUser();
  //   window.localStorage.getItem(`${user.uid}DEFAULT_STORE`);
  // }
  async setActiveStoreKey(newKey) {
    const currentKey = await this.getlatest();
    if (newKey !== currentKey) {
      // this._activeStoreKey = newKey;
      await this.setDefaultStoreKey(newKey);
      this.subject.next(newKey);
    }
  }
  // private clearActiveStoreKey() {
  //   return this.setActiveStoreKey(null);
  // }
}
