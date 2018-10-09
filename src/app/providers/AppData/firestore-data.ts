import { Editable, Extended, ExtMap } from "../../interfaces/data-models";
import { Observable } from "rxjs";
import { map, share, refCount, publishReplay, first, switchMap } from "rxjs/operators";
import {
  AngularFirestoreCollection,
  AngularFirestore,
  QueryDocumentSnapshot,
  DocumentChangeAction
} from "@angular/fire/firestore";
import { firestore } from "firebase";
import * as firebase from "firebase";
import { compareTimeStamp } from "../../Util/compare-timetamp";
import { instanceAvailability } from "@ionic-native/core";

export class FirestoreData<T extends Editable> {
  get FormatedList(): Observable<any[]> {
    return this.dataList;
  }
  private dataList: Observable<Extended<T>[]>;
  protected collection: AngularFirestoreCollection<T>;
  dataMap: Observable<ExtMap<Extended<T>>>;

  constructor(protected afs: AngularFirestore,
     protected path: string | Observable<string>) {
    console.log("Hello FBRepository Provider");
    if (typeof path === "string") {
      this.initialize(path);
    } else if (path instanceof Observable) {
      this.reactiveInitialize(path);
    }
  }

  private reactiveInitialize(path$: Observable<string>) {

    const snapshotChanges = path$.pipe(switchMap(path => {
      this.path = path;

      this.collection = this.afs.collection(path);
      return this.collection.snapshotChanges();
    })).pipe(share());
    this.initData(snapshotChanges);
  }

  private initData(snapshotChanges: Observable<DocumentChangeAction<T>[]>) {
    this.dataList = this.snapList(snapshotChanges).pipe(publishReplay(1), refCount());
    this.dataMap = this.snapshotMap(snapshotChanges).pipe(publishReplay(1), refCount());
  }

  initialize(path: string) {
    this.path = path;
    console.log(`path : ${path} `);

    this.collection = this.afs.collection(path);
    const snapshotChanges = this.collection.snapshotChanges().pipe(share());
    this.initData(snapshotChanges);
  }
  snapList(
    snapshotChanges: Observable<DocumentChangeAction<T>[]>
  ): Observable<Extended<T>[]> {
    return snapshotChanges.pipe(
      map(actions => {
        return actions
          .map(a => this.extractSnapshotData(a.payload.doc))
          .sort((a, b) => {
            return compareTimeStamp(a.data.lastEditedOn, b.data.lastEditedOn);
          });
      })
    );
  }

  snapshotMap(
    snapshotChanges: Observable<DocumentChangeAction<T>[]>
  ): Observable<ExtMap<Extended<T>>> {
    const _map = new ExtMap<Extended<T>>();

    return snapshotChanges.pipe(
      map(actions => {
        actions.forEach(a => {
          const docData = this.extractSnapshotData(a.payload.doc);
          _map.set(docData.id, docData);
        });
        return _map;
      })
    );
  }
  List(): Observable<Extended<T>[]> {
    return this.dataList;
  }

  get(key): Observable<Extended<T>> {
    return this.afs
      .doc<T>(this.path + `/${key}`)
      .snapshotChanges()
      .pipe(map(a => this.extractSnapshotData(a.payload)));
  }

  private extractSnapshotData(snapshot: QueryDocumentSnapshot<T>) {
    const meta = snapshot.metadata;
    let data: T;
    if (snapshot.exists) {
      data = snapshot.data() as T;
    } else {
      console.log("Empty doc snapshot :", snapshot);
    }
    const id = snapshot.id;
    const ret = { id, data, ext: {}, meta };
    return ret;
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

  public parseBeforeSave(obj: Extended<T>) {
    return { id: obj.id, data: this.remove$Properties(obj.data) };
  }
  protected remove$Properties(obj: any) {
    Object.keys(obj).forEach(key => {
      if (key.startsWith("$")) {
        delete obj[key];
      }
    });
  }

  catch(err) {
    console.error("Error saving", err);
    throw err;
  }

  saveNew(item: Extended<T>, key?: string) {
    key = key || this.newKey();
    this.parseBeforeSave(item);
    item.data.lastEditedOn = firebase.firestore.FieldValue.serverTimestamp();
    item.data.firstCreatedOn = firebase.firestore.FieldValue.serverTimestamp();
    if (key) {
      return this.collection
        .doc(key)
        .set(item.data)
        .then(() => key)
        .catch(this.catch);
    }
  }

  public remove(item: Extended<T>) {
    // this.parseBeforeSave(item);
    return this.collection
      .doc(item.id)
      .delete()
      .catch(this.catch);
    // return this.fbLoggableSaver.remove(item, this.urlOrRef)
  }

  newKey() {
    return this.collection.ref.firestore
      .collection(this.collection.ref.path)
      .doc().id;
  }
  saveOld(editedItem: Extended<T>) {
    // let key = editedItem.$key;
    const data = editedItem.data;
    data.lastEditedOn = firebase.firestore.FieldValue.serverTimestamp();
    // this.parseBeforeSave(copy);
    return this.collection
      .doc(editedItem.id)
      .update(data)
      .catch(this.catch);
  }
}
