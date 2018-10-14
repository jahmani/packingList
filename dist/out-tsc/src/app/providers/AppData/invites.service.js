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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var operators_1 = require("rxjs/operators");
var users_service_1 = require("./users.service");
var store_info_service_1 = require("./store-info.service");
var InvitesService = /** @class */ (function (_super) {
    __extends(InvitesService, _super);
    function InvitesService(afs, usersFsRepository, storesFsRepository) {
        var _this = _super.call(this, afs, "versions/v4/invites") || this;
        _this.usersFsRepository = usersFsRepository;
        _this.storesFsRepository = storesFsRepository;
        console.log("Hello StoreUsersFsRepository Provider");
        return _this;
    }
    InvitesService.prototype.invite = function (userId, storeId) {
        var invite = { userId: userId, storeId: storeId, state: "PENDING" };
        var extInvite = { data: invite };
        return _super.prototype.saveNew.call(this, extInvite);
    };
    InvitesService.prototype.getStoreInvites = function (storeId, state) {
        var invitesColl = this.afs.collection(this.collection.ref.path, function (ref) {
            var reference = ref.where("storeId", "==", storeId);
            if (state) {
                reference = reference.where("state", "==", state);
            }
            return reference;
        });
        return this.snapList(invitesColl.snapshotChanges()).pipe(operators_1.mergeMap(this.extendUsers.bind(this)));
    };
    InvitesService.prototype.getUserInvites = function (userId, state) {
        var invitesColl = this.afs.collection(this.collection.ref.path, function (ref) {
            var reference = ref.where("userId", "==", userId);
            if (state) {
                reference = reference.where("state", "==", state);
            }
            return reference;
        });
        return this.snapList(invitesColl.snapshotChanges()).pipe(operators_1.mergeMap(this.extendStores));
    };
    InvitesService.prototype.extendUsers = function (extInvites) {
        var _this = this;
        var promises = extInvites.map(function (extInvite) {
            return _this.usersFsRepository
                .getOnce(extInvite.data.userId)
                .then(function (extUser) {
                extInvite.ext.user = extUser.data;
                return extInvite;
            });
        });
        return Promise.all(promises);
    };
    InvitesService.prototype.extendStores = function (extInvites) {
        var _this = this;
        var promises = extInvites.map(function (extInvite) {
            return _this.storesFsRepository
                .getOnce(extInvite.data.storeId)
                .then(function (extStore) {
                extInvite.ext.store = extStore.data;
                return extInvite;
            });
        });
        return Promise.all(promises);
    };
    InvitesService.prototype.accpetInvite = function (inviteId) {
        return this.InviteState(inviteId, "ACCEPTED");
    };
    InvitesService.prototype.rejectInvite = function (inviteId) {
        return this.InviteState(inviteId, "REJECTED");
    };
    InvitesService.prototype.canceleInvite = function (inviteId) {
        return this.InviteState(inviteId, "CANCELED");
    };
    InvitesService.prototype.InviteState = function (inviteId, inviteState) {
        var _this = this;
        return this.getOnce(inviteId).then(function (extInvite) {
            var copyExtInvite = __assign({}, extInvite, { data: __assign({}, extInvite.data) });
            copyExtInvite.data.state = inviteState;
            return _this.saveOld(copyExtInvite);
        });
    };
    InvitesService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [firestore_1.AngularFirestore,
            users_service_1.UsersService,
            store_info_service_1.StoreInfoService])
    ], InvitesService);
    return InvitesService;
}(firestore_data_1.FirestoreData));
exports.InvitesService = InvitesService;
//# sourceMappingURL=invites.service.js.map