
// import * as functions from 'firebase-functions';
// const admin = require('firebase-admin');
// const db = admin.firestore();

// export const onStoreInfoChange = functions.firestore.document('/versions/v4/storesInfo/{storeId}').onUpdate(
//   async(snap, context) => {

//     const storeInfo = snap.after.data();
//     const storeId = snap.after.id;
//     console.log(`storeId: ${storeId}`);
//     const batch = admin.firestore().batch()
//     console.log(`storeInfo : ${(JSON.stringify(storeInfo))}`)

//     //if(context.auth){
//         const userId = uid;
//         const userInfo = (await db.doc(`/users/${userId}`).get()).data() as User;

//         const us: UserStore = {storeInfo: storeInfo, status: "OWNER"} as UserStore;
//         const userStoreRef = admin.firestore().doc(`users/${userId}/stores/${storeId}`)
//         console.log(`users/${userId}/stores/${storeId}`)

//         batch.set(userStoreRef, us)

//         const su: StoreUser = {userInfo, isAdmin:true, isEnabled: true,  rule:'owner', canRead:true, canWrite:true};
//         const storeUserRef = admin.firestore().doc(`/versions/v4/stores/${storeId}/users/${userId}`);
//         console.log(`/versions/v4/stores/${storeId}/users/${userId}`)
//         batch.set(storeUserRef, su)

//      //   }

//     return batch.commit().then(function () {
//         console.log("onCreatUser  successfully committed!");
//     }).catch(function (error: any) {
//         console.log("onCreatUser  failed: ", error);
//     });
// })

