import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild } from '@angular/router';
import { ActiveStoreService } from '../AppData/active-store.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoreGuardService implements CanActivateChild {
  constructor(
    private activeStoreService: ActiveStoreService
  ) { }
  canActivateChild(route: ActivatedRouteSnapshot) {
    return this.activeStoreService.activeStoreKey$.pipe(map(storeId => !!storeId));
  }
}
