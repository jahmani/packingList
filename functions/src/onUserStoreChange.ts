// import { UserStore, User, StoreUser } from "./interfaces";

import functions = require('firebase-functions');
import admin = require('firebase-admin');
import { StoreUser, User } from './interfaces';
const db = admin.firestore();

export const onNewUserStoreChange = functions.firestore.document('/users/{userId}/stores/{storeId}').onUpdate(
    async (change, context) => {

        const userStoreInfo = change.after.data();
        const prevUserStoreInfo = change.before.data();
        const storeId = context.params.storeId;
        console.log(`storeId: ${storeId}`);
        const batch = admin.firestore().batch();
        console.log(`userStoreInfo : ${(JSON.stringify(userStoreInfo))}`);
        // const storeInfo = userStoreInfo.storeInfo;
        const uid = context.params.userId;
        console.log(`uid: ${uid}`);

        if (!prevUserStoreInfo) {
            console.log('no prevUserStoreInfo');
            return;
        }
        if (!userStoreInfo) {
            console.log('no userStoreInfo');
            return;
        }
        console.log('prevUserStoreInfo.status: ', prevUserStoreInfo.status);
        console.log('userStoreInfo.status: ', userStoreInfo.status);
        if (prevUserStoreInfo.status === "INVITED" && userStoreInfo.status ==='ACTIVE') {
            const storeUserRef = admin.firestore().doc(`/versions/v4/stores/${storeId}/users/${uid}`);
            const storeUserData: StoreUser = {canRead: true, isEnabled: true, isAdmin: false}  as StoreUser;

            const userInfo = (await db.doc(`/users/${uid}`).get()).data() as User;
            storeUserData.userInfo = userInfo;


            batch.set(storeUserRef, storeUserData)
        }

        //if(context.auth){
        // const userId = uid;
        // const userInfo = (await db.doc(`/users/${userId}`).get()).data() as User;

        // const us: UserStore = {storeInfo: storeInfo, status: "OWNER"} as UserStore;
        // const userStoreRef = admin.firestore().doc(`users/${userId}/stores/${storeId}`)
        // console.log(`users/${userId}/stores/${storeId}`)

        // batch.set(userStoreRef, us)

        // const su: StoreUser = {userInfo, isAdmin:true, isEnabled: true,  rule:'owner', canRead:true, canWrite:true};
        // const storeUserRef = admin.firestore().doc(`/versions/v4/stores/${storeId}/users/${userId}`);
        // console.log(`/versions/v4/stores/${storeId}/users/${userId}`)
        // batch.set(storeUserRef, su)

        //   }

        return batch.commit().then(function () {
            console.log("onUserStoreChange  successfully committed!");
        }).catch(function (error: any) {
            console.log("onUserStoreChange  failed: ", error);
        });
    })

