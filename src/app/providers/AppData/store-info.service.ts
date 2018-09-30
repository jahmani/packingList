import { Injectable } from "@angular/core";
import { FirestoreData } from "./firestore-data";
import { StoreDoc, StoreInfo, StoreUser } from "../../interfaces/data-models";
import { AngularFirestore } from "@angular/fire/firestore";
import { StorePathConfig } from "../../interfaces/StorePathConfig";
import * as firebase from "firebase";

@Injectable({
  providedIn: "root"
})
export class StoreInfoService extends FirestoreData<StoreDoc> {
  constructor(afs: AngularFirestore) {
    super(afs, StorePathConfig.basePath);
    console.log("Hello StoreInfoService Provider");
  }

  createNewStore(ownerUid: string, storeName: string = "new Store") {
    const storeInfo: StoreInfo = { name: storeName } as StoreInfo;
    const storeUser: StoreUser = {
      canRead: true,
      canWrite: true,
      isEnabled: true,
      role: "owner"
    } as StoreUser;

    const batch = firebase.firestore().batch();

    const storeDoc = firebase
      .firestore()
      .collection(StorePathConfig.basePath)
      .doc();
    const storeId = storeDoc.id;
    const userDoc = firebase.firestore().doc(`users/${ownerUid}`);
    const storeUserDoc = storeDoc.collection("users").doc(ownerUid);
    const userStoreDoc = userDoc.collection("stores").doc(storeId);

    batch.set(storeDoc, { storeInfo });
    batch.set(storeUserDoc, storeUser);
    batch.set(userStoreDoc, {});

    const storeTransactionCatsColl = storeDoc.collection("transactionCats");
    const proms1 = this.getTransactionCatsData().then(docSnapshots => {
      for (const docSnapshot of docSnapshots) {
        batch.set(
          storeTransactionCatsColl.doc(docSnapshot.id),
          docSnapshot.data()
        );
      }
    });
    return proms1.then(() => {
      return batch.commit();
    });
  }
  getTransactionCatsData() {
    const transCatsdataTemplatColl = firebase
      .firestore()
      .collection(StorePathConfig.transCatsTemplatPath);
    return transCatsdataTemplatColl.get().then(querySnapshot => {
      return querySnapshot.docs;
    });
  }
}
