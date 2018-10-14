"use strict";
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
var firestore_1 = require("@angular/fire/firestore");
var auth_service_1 = require("../Auth/auth.service");
var operators_1 = require("rxjs/operators");
var contact_paths_1 = require("../../Util/contact-paths");
var firestore_data_1 = require("./firestore-data");
var store_info_service_1 = require("./store-info.service");
var UserPendingStoresService = /** @class */ (function () {
    function UserPendingStoresService(afs, auth, storeInfoFsRepository) {
        //   super(afs, conatctPaths("users", auth.currentUser.uid, "pendingStores"));
        this.storeInfoFsRepository = storeInfoFsRepository;
        console.log("Hello UserPendingStoresFsRepositoryProvider Provider");
        this.fsRep$ = auth.user.pipe(operators_1.map(function (user) {
            if (user) {
                return new firestore_data_1.FirestoreData(afs, contact_paths_1.conatctPaths("users", user.uid, "pendingStores"));
            }
            else {
                return null;
            }
        }));
    }
    UserPendingStoresService.prototype.List = function () {
        return this.fsRep$.pipe(operators_1.mergeMap(function (fsRep) { return fsRep && fsRep.List(); }));
    };
    Object.defineProperty(UserPendingStoresService.prototype, "FormatedList", {
        get: function () {
            var _this = this;
            return this.List().pipe(operators_1.mergeMap(function (stores) {
                return Promise.all(_this.getStores(_this, stores));
            }));
        },
        enumerable: true,
        configurable: true
    });
    UserPendingStoresService.prototype.getStores = function (self, extUserStores) {
        return extUserStores.map(function (extUserStore) {
            return self.storeInfoFsRepository.getOnce(extUserStore.id).then(function (store) {
                extUserStore.ext.store = store.data;
                return extUserStore;
            });
        });
    };
    UserPendingStoresService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [firestore_1.AngularFirestore,
            auth_service_1.AuthService,
            store_info_service_1.StoreInfoService])
    ], UserPendingStoresService);
    return UserPendingStoresService;
}());
exports.UserPendingStoresService = UserPendingStoresService;
//# sourceMappingURL=user-pending-stores.service.js.map