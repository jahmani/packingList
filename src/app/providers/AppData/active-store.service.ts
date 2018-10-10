import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { share, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ActiveStoreService {
  private subject: BehaviorSubject<string>;
  private _activeStoreKey = "HW1TAwI2hz0pLNINa51Q";
  _activeStoreKey$: Observable<string>;
  constructor() {
    this.subject = new BehaviorSubject("HW1TAwI2hz0pLNINa51Q");
    this._activeStoreKey$ = this.subject.asObservable();
  }
  get activeStoreKey() {
    return this._activeStoreKey;
  }
  get activeStoreKey$() {
    return this._activeStoreKey$;
  }
  public getReactivePath(subPath: string) {

  }
  setDefaultStoreKey(newKey) {
    window.localStorage.setItem("DEFAULT_STORE", newKey);
  }
  getDefaultStoreKey() {
    return window.localStorage.getItem("DEFAULT_STORE");
  }
  setActiveStoreKey(newKey) {
    if (newKey !== this._activeStoreKey) {
      this._activeStoreKey = newKey;
      //  this.setDefaultStoreKey(newKey);
      this.subject.next(newKey);
    }
  }
  clearActiveStoreKey() {
    return this.setActiveStoreKey(null);
  }
}
