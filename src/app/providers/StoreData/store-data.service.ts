import { Editable, Extended } from "../../interfaces/data-models";
import { AppData, FireStoreData } from "../AppData/firestore-data";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActiveStoreService } from "../AppData/active-store.service";
import { conatctPaths } from "../../Util/contact-paths";
import { StorePathConfig } from "../../interfaces/StorePathConfig";
import { map, share, take, switchMap, startWith, first } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { ProductsDataService } from "./products-data.service";
// import firebase from "firebase";
import * as firebase from "firebase/app";
import { ReactivePathFirestoreData } from "../AppData/reactive-path-firestore-data.service";

interface RepositoryMap {
  [name: string]: StoreDataService<any>;
}



export class StoreDataService<T extends Editable> extends ReactivePathFirestoreData<T> {
  protected path$: Observable<string>;
  constructor(
    public afs: AngularFirestore,
    private ass: ActiveStoreService,
    private dataSubPath: string
  ) {
    super(
      afs,
      ass.activeStoreKey$.pipe(
        map(storePath => {
          if (storePath) {
            return conatctPaths(StorePathConfig.basePath, storePath, dataSubPath);

          } else {
            return "NULLPATH";
          }
        })
      )
    );
//    this.reactiveInitialize( );
  }
  // ForStore(storeId) {
  //   return new AppData(this.afs, of(conatctPaths(StorePathConfig.basePath, storeId, this.dataSubPath)));
  // }
  // get(key): Observable<Extended<T>> {
  //   return this.path$
  //     .pipe(
  //       switchMap(path => {
  //         return this.afs.doc<T>(path + `/${key}`).snapshotChanges();
  //       })
  //     )
  //     .pipe(map(a => this.extractSnapshotData(a.payload)));
  // }

  // getOnce(key): Promise<Extended<T>> {
  //   return this.get(key)
  //     .pipe(first())
  //     .toPromise();
  // }

  // getOrCreate(key): Promise<Extended<T>> {
  //   return this.getOnce(key)
  //     .then(val => val)
  //     .catch(err => {
  //       console.log("getOrCreate err : ", err);
  //       return { id: key, data: null };
  //     });
  // }

  // private reactiveInitialize(path$: Observable<string>) {
  //   this.path$ = path$;
  //   const snapshotChanges = path$.pipe(
  //     switchMap(path => {
  //       // this.path = path;
  //       this.collection = this.afs.collection(path);
  //       return this.collection.snapshotChanges().pipe(startWith([]));
  //     })
  //   );
  //   this.initData(snapshotChanges);
  // }

  // newKeyReactive() {
  //   return this.path$.pipe(take(1)).toPromise().then(path => {
  //     return this.afs
  //       .collection(path).ref.doc().id;
  //   });
  //   // .ref.firestore
  //   //   .collection(this.collection.ref.path)
  //   //   .doc().id;
  // }
  // reactiveRemove(item: Extended<T>) {
  //   // let key = editedItem.$key;
  //  // const data = editedItem.data;
  //  // data.lastEditedOn = firebase.firestore.FieldValue.serverTimestamp();
  //   // this.parseBeforeSave(copy);
  //   return this.path$.pipe(take(1)).toPromise().then(path => {
  //     this.afs
  //       .collection(path)
  //       .doc(item.id)
  //       .delete()
  //       .catch(this.catch);
  //   });
  // }
  // reactiveSaveOld(editedItem: Extended<T>) {
  //   // let key = editedItem.$key;
  //   const data = editedItem.data;
  //   data.lastEditedOn = firebase.firestore.FieldValue.serverTimestamp();
  //   // this.parseBeforeSave(copy);
  //   return this.path$.pipe(take(1)).toPromise().then(path => {
  //     this.afs
  //       .collection(path)
  //       .doc(editedItem.id)
  //       .update(data)
  //       .catch(this.catch);
  //   });
  // }
  // async reactiveSaveNew(item: Extended<T>,  key?: string) {
  //   key = key || await this.newKeyReactive();
  //   item.data.lastEditedOn = firebase.firestore.FieldValue.serverTimestamp();
  //   item.data.firstCreatedOn = firebase.firestore.FieldValue.serverTimestamp();
  //   // this.parseBeforeSave(copy);
  //   return this.path$.pipe(take(1)).toPromise().then(path => {
  //     this.afs
  //       .collection(path)
  //       .doc(key)
  //       .set(item.data)
  //       .then(() => key)
  //       .catch(this.catch);
  //   });
  // }


  // productsData = new ProductsDataService(this.afs,this.ass,)
}
