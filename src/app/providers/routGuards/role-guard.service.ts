import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth/auth.service';
import { StoreUsersDataService } from '../StoreData/store-users-data.service';
import { switchMap, map } from 'rxjs/operators';
import { u } from 'tar';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(private _authService: AuthService, private _router: Router, private storeUsers: StoreUsersDataService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = this._authService.user.pipe(switchMap(_user => this.storeUsers.get(_user.uid)));
    const canReadProducts = user.pipe(map(su => {
      return su.data.permesions && su.data.permesions.canReadProducts;
    }
    ));
    return canReadProducts;
    // if (user === next.data.role) {
    //   return true;
    // }

    // // navigate to not found page
    // this._router.navigate(['/404']);
    // return false;
  }
}
