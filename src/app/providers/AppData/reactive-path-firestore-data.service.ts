import { Injectable } from '@angular/core';
import { Editable, Extended } from '../../interfaces/data-models';
import { FireStoreData } from './firestore-data';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap, map, first, startWith, take } from 'rxjs/operators';
import firebase from 'firebase/app';

// @Injectable({
//   providedIn: 'root'
// })
export class ReactivePathFirestoreData<T extends Editable> extends FireStoreData<T> {

  constructor(
    protected afs: AngularFirestore,
    protected path$: Observable<string>
  ) {
    super( );
    this.reactiveInitialize( path$);
  }
  get(key): Observable<Extended<T>> {
    return this.path$
      .pipe(
        switchMap(path => {
          return this.afs.doc<T>(path + `/${key}`).snapshotChanges();
        })
      )
      .pipe(map(a => this.extractSnapshotData(a.payload)));
  }

  getOnce(key): Promise<Extended<T>> {
    return this.get(key)
      .pipe(first())
      .toPromise();
  }

  getOrCreate(key): Promise<Extended<T>> {
    return this.getOnce(key)
      .then(val => val)
      .catch(err => {
        console.log("getOrCreate err : ", err);
        return { id: key, data: null };
      });
  }

  private reactiveInitialize(path$: Observable<string>) {
    this.path$ = path$;
    const snapshotChanges = path$.pipe(
      switchMap(path => {
        // this.path = path;
        this.collection = this.afs.collection(path);
        return this.collection.snapshotChanges().pipe(startWith([]));
      })
    );
    this.initData(snapshotChanges);
  }

  newKey() {
    return this.path$.pipe(take(1)).toPromise().then(path => {
      return this.afs
        .collection(path).ref.doc().id;
    });
  }
  remove(item: Extended<T>) {
    return this.path$.pipe(take(1)).toPromise().then(path => {
      this.afs
        .collection(path)
        .doc(item.id)
        .delete()
        .catch(this.catch);
    });
  }
  saveOld(editedItem: Extended<T>) {
    const data = editedItem.data;
    data.lastEditedOn = firebase.firestore.FieldValue.serverTimestamp();
    return this.path$.pipe(take(1)).toPromise().then(path => {
      this.afs
        .collection(path)
        .doc(editedItem.id)
        .update(data)
        .catch(this.catch);
    });
  }
  async saveNew(item: Extended<T>,  key?: string) {
    key = key || await this.newKey();
    item.data.lastEditedOn = firebase.firestore.FieldValue.serverTimestamp();
    item.data.firstCreatedOn = firebase.firestore.FieldValue.serverTimestamp();
    // this.parseBeforeSave(copy);
    return this.path$.pipe(take(1)).toPromise().then(path => {
      this.afs
        .collection(path)
        .doc(key)
        .set(item.data)
        .then(() => key)
        .catch(this.catch);
    });
  }

}
