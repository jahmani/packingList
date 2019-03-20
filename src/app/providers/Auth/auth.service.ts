import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import {AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<firebase.User>;
  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore) {
    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState;

    this.user.subscribe((user) => {
      console.log("Currently Loged in : ", user);
    });

  }
  get currentUser() {
    return this.afAuth.auth.currentUser;
  }
  signInWithEmail(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }


  signupUser(email: string, password: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(
      (newUser) => {
        return this.signInWithEmail(email, password)
          .then((credential) => {
        //   this.updateUserData(credential);
          });
      });
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }
  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
       // this.updateUserData(credential.user)
      });
  }
  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const { uid, email, displayName, photoURL } = user;

    const data: Partial<firebase.User> = { uid, email, displayName, photoURL };
    return userRef.set(data);
  }
  signOut() {
    this.afAuth.auth.signOut().then(() => {
      // todo: add after logout logic here
    });
  }}
