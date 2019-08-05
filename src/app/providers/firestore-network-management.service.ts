import { Injectable } from '@angular/core';
import firebase from 'firebase';

// @Injectable({
//   providedIn: 'root'
// })
class FirestoreNetworkManagementService {
  enableToId;
  isEnabled = true;
  disableToId;
  timeoutMs = 50;

  constructor() { }
  disableNetwork() {
    if (this.isEnabled) {
      this.goOffline();
      this.disableToId =  setTimeout(() => {
        this.goOnline();
      }, this.timeoutMs);
    } else {
      clearTimeout(this.disableToId);
      this.disableToId = setTimeout(() => {
        this.goOnline();
      }, this.timeoutMs);
    }
  }
  public goOnline() {
    firebase.firestore().enableNetwork();
    this.isEnabled = true;
    console.log('now online');
  }

  public goOffline() {
    firebase.firestore().disableNetwork();
    this.isEnabled = false;
    console.log('now offline');

  }
  public get isOnline() {
    return this.isEnabled;
  }


}
const _netService = new FirestoreNetworkManagementService();
export function firestoreNetworkManagementService() {
  return _netService;
}
