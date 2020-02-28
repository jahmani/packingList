import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(private afs: AngularFirestore) {
    // this.afs.firestore.s
  }

  disableNetwork() {
    this.afs.firestore.disableNetwork().then(() => {
      console.log("Network disabled");
      setTimeout(() => {
        this.afs.firestore.enableNetwork().then(() => {
          console.log("Network enabled");
        });
      }, 100);
    });
  }
}
