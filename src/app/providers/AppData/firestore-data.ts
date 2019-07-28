import { Editable, Extended, ExtMap } from "../../interfaces/data-models";
import { Observable } from "rxjs";
import {
  map,
  first,
  shareReplay,
} from "rxjs/operators";
import {
  AngularFirestoreCollection,
  AngularFirestore,
  QueryDocumentSnapshot,
  DocumentChangeAction
} from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import { compareTimeStamp } from "../../Util/compare-timetamp";


export class FireStoreData<T extends Editable> {
  get FormatedList(): Observable<Extended<T>[]> {
    return this.list;
  }
  public list: Observable<Extended<T>[]>;
  protected collection: AngularFirestoreCollection<T>;
  dataMap: Observable<ExtMap<Extended<T>>>;

  constructor(  ) {
  }
  protected initData(snapshotChanges: Observable<DocumentChangeAction<T>[]>) {
    this.list = this.snapList(snapshotChanges)
      .pipe(
        //  share()
        shareReplay(1)
        //  publishReplay(1),
        //  refCount()
      );
    this.dataMap = this.snapshotMap(snapshotChanges)
      .pipe(
        //  share()
        shareReplay(1)
        //  publishReplay(1),
        //  refCount()
      );

  }

  snapList(snapshotChanges: Observable<DocumentChangeAction<T>[]>): Observable<Extended<T>[]> {
    return snapshotChanges.pipe(
      map(actions => {
        const res = actions
          .map(a => this.extractSnapshotData(a.payload.doc))
          .sort((a, b) => {
            return compareTimeStamp(a.data.lastEditedOn, b.data.lastEditedOn);
          });
        return res;
      })
    );
  }

  snapshotMap(snapshotChanges: Observable<DocumentChangeAction<T>[]>): Observable<ExtMap<Extended<T>>> {
    return snapshotChanges.pipe(
      map(actions => {
        const _map = new ExtMap<Extended<T>>();
        actions.forEach(a => {
          const docData = this.extractSnapshotData(a.payload.doc);
          _map.set(docData.id, docData);
        });
        return _map;
      })
    );
  }
  List(): Observable<Extended<T>[]> {
    return this.list;
  }

  protected extractSnapshotData(snapshot: QueryDocumentSnapshot<T>) {
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

  catch(err) {
    console.error("Error saving", err);
    throw err;
  }

}

export class AppData<T extends Editable> extends FireStoreData<T>  {
  protected path: string;
  constructor(
    protected afs: AngularFirestore,
    path: string | Observable<string>
  ) {
    super();
    console.log("Hello FBRepository Provider");
    if (typeof path === "string") {
      this.initialize(path);
    }
  }

  initialize(path: string) {
    this.path = path;
    // this.path$ = of(path);
    console.log(`path : ${path} `);

    this.collection = this.afs.collection(path);
    const snapshotChanges = this.collection
      .snapshotChanges()
      .pipe
      //  share()
      ();
    this.initData(snapshotChanges);
  }


  get(key): Observable<Extended<T>> {

    return this.afs.doc<T>(this.path + `/${key}`).snapshotChanges()
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

    return this.collection
      .doc(editedItem.id)
      .update(data)
      .catch(this.catch);
  }

  saveNew(item: Extended<T>, key?: string) {
    key = key || this.newKey();
    // this.parseBeforeSave(item);
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
}
