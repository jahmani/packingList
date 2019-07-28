import { UserStore, User, StoreUser } from "./interfaces";

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

export const onNewStore = functions.firestore.document('/versions/v4/storesInfo/{storeId}').onCreate(
  async(snap: any, context: any) => {

    const storeInfo = snap.data();
    const storeId = context.params.storeId;
    console.log(`storeId: ${storeId}`);
    const batch = admin.firestore().batch()
    console.log(`storeInfo : ${(JSON.stringify(storeInfo))}`)
    const uid = storeInfo.creatorId;
    console.log(`uid: ${uid}`);

    //if(context.auth){
        const userId = uid;
        const userInfo = (await db.doc(`/users/${userId}`).get()).data() as User;

        const us: UserStore = {storeInfo: storeInfo, status: "OWNER"} as UserStore;
        const userStoreRef = admin.firestore().doc(`users/${userId}/stores/${storeId}`)
        console.log(`users/${userId}/stores/${storeId}`)

        batch.set(userStoreRef, us)

        const su: StoreUser = {userInfo, isAdmin:true, isEnabled: true,  rule:'owner', canRead:true, canWrite:true};
        const storeUserRef = admin.firestore().doc(`/versions/v4/stores/${storeId}/users/${userId}`);
        console.log(`/versions/v4/stores/${storeId}/users/${userId}`)
        batch.set(storeUserRef, su)

     //   }

    return batch.commit().then(function () {
        console.log("onCreatUser  successfully committed!");
    }).catch(function (error: any) {
        console.log("onCreatUser  failed: ", error);
    });
})

