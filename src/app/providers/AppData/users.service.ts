import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { FirestoreData } from "./firestore-data";
import { User } from "../../interfaces/data-models";
import { StorePathConfig } from "../../interfaces/StorePathConfig";
import { first } from "rxjs/internal/operators/first";

@Injectable({
  providedIn: "root"
})
export class UsersService extends FirestoreData<User> {
  constructor(protected afs: AngularFirestore) {
    super(afs, StorePathConfig.Users);
  }
  getByEmail(email: string) {
    const encodedEmal = email.replace(".", "|");
    return this.afs
      .doc<{ uid: string }>(StorePathConfig.usersByEmail + `/${encodedEmal}`)
      .valueChanges()
      .pipe(first())
      .toPromise();
  }
}
