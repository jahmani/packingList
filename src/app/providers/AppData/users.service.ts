import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { FirestoreData } from "./firestore-data";
import { User, Extended } from "../../interfaces/data-models";
import { StorePathConfig } from "../../interfaces/StorePathConfig";
import { first } from "rxjs/internal/operators/first";
import { AuthService } from "../Auth/auth.service";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class UsersService extends FirestoreData<User> {
  currentUser: Observable<Extended<User>>;
  constructor(
    protected afs: AngularFirestore,
    private authService: AuthService) {

    super(afs, StorePathConfig.Users);

    this.currentUser = this.authService.user.pipe(
      switchMap(u => {
        if (u) {
          const user = this.get(u.uid);
          return user;
        } else {
          return of(null);
        }
      })
    );
  }
  getByEmail(email: string) {
    const encodedEmal = email.replace(".", "|");
    return this.afs
      .doc<{ uid: string }>(StorePathConfig.usersByEmail + `/${encodedEmal}`)
      .valueChanges()
      .pipe(first(), switchMap(val => {
        if (val) {
          return this.get(val.uid);

        } else {
          const notFound = {notFound : email} as unknown as Extended<User>;
          return of(notFound);
        }
      }));
  }
  getByPhoneNumber(phoneNumber: string): Observable<Extended<User>> {
    // const encodedEmal = phoneNumber.replace(".", "|");
    return this.afs
      .doc<{ uid: string }>(StorePathConfig.usersByPhoneNumber + `/${phoneNumber}`)
      .valueChanges()
      .pipe(first(), switchMap(val => {
        if (val) {
          return this.get(val.uid);

        } else {
          const notFound = {notFound : phoneNumber} as unknown as Extended<User>;
          return of(notFound);
        }
      }));
    // .toPromise();
  }
}
