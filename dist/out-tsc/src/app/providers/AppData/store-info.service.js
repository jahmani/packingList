"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var firestore_data_1 = require("./firestore-data");
var firestore_1 = require("@angular/fire/firestore");
var StorePathConfig_1 = require("../../interfaces/StorePathConfig");
var firebase = require("firebase");
var StoreInfoService = /** @class */ (function (_super) {
    __extends(StoreInfoService, _super);
    function StoreInfoService(afs) {
        var _this = _super.call(this, afs, StorePathConfig_1.StorePathConfig.storesInfo) || this;
        console.log("Hello StoreInfoService Provider");
        return _this;
    }
    StoreInfoService.prototype.replicateStoreInfo = function () {
        /*   const col = this.afs.collection(StorePathConfig.storesInfo);
         this.List().subscribe((storDos => {
           storDos.forEach((stor => {
             const doc = col.doc(stor.id);
             doc.set(stor.data.storeInfo);
           }));
         }));
     */ 
    };
    StoreInfoService.prototype.createNewStore = function (ownerUid, storeName) {
        if (storeName === void 0) { storeName = "new Store"; }
        var storeInfo = { name: storeName };
        var storeUser = {
            canRead: true,
            canWrite: true,
            isEnabled: true,
            role: "owner"
        };
        var batch = firebase.firestore().batch();
        var storeDoc = firebase
            .firestore()
            .collection(StorePathConfig_1.StorePathConfig.basePath)
            .doc();
        var storeInfoDoc = firebase
            .firestore()
            .collection(StorePathConfig_1.StorePathConfig.storesInfo)
            .doc();
        var storeId = storeDoc.id;
        var userDoc = firebase.firestore().doc("users/" + ownerUid);
        var storeUserDoc = storeDoc.collection("users").doc(ownerUid);
        var userStoreDoc = userDoc.collection("stores").doc(storeId);
        batch.set(storeInfoDoc, storeInfo);
        batch.set(storeUserDoc, storeUser);
        batch.set(userStoreDoc, {});
        var storeTransactionCatsColl = storeDoc.collection("transactionCats");
        var proms1 = this.getTransactionCatsData().then(function (docSnapshots) {
            for (var _i = 0, docSnapshots_1 = docSnapshots; _i < docSnapshots_1.length; _i++) {
                var docSnapshot = docSnapshots_1[_i];
                batch.set(storeTransactionCatsColl.doc(docSnapshot.id), docSnapshot.data());
            }
        });
        return proms1.then(function () {
            return batch.commit();
        });
    };
    StoreInfoService.prototype.getTransactionCatsData = function () {
        var transCatsdataTemplatColl = firebase
            .firestore()
            .collection(StorePathConfig_1.StorePathConfig.transCatsTemplatPath);
        return transCatsdataTemplatColl.get().then(function (querySnapshot) {
            return querySnapshot.docs;
        });
    };
    StoreInfoService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [firestore_1.AngularFirestore])
    ], StoreInfoService);
    return StoreInfoService;
}(firestore_data_1.FirestoreData));
exports.StoreInfoService = StoreInfoService;
//# sourceMappingURL=store-info.service.js.map