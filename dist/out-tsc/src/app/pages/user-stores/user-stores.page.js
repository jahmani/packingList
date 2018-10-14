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
var auth_service_1 = require("../../providers/Auth/auth.service");
var user_stores_service_1 = require("../../providers/AppData/user-stores.service");
var active_store_service_1 = require("../../providers/AppData/active-store.service");
var user_pending_stores_service_1 = require("../../providers/AppData/user-pending-stores.service");
var store_info_service_1 = require("../../providers/AppData/store-info.service");
var invites_service_1 = require("../../providers/AppData/invites.service");
var operators_1 = require("rxjs/operators");
var router_1 = require("@angular/router");
var UserStoresPage = /** @class */ (function () {
    function UserStoresPage(router, 
    // tslint:disable-next-line:no-shadowed-variable
    auth, userStoresFsRepository, userPendingStoresFsRepository, storesFsRepository, invitesFsRepository, activeStoreServise) {
        this.router = router;
        this.auth = auth;
        this.userStoresFsRepository = userStoresFsRepository;
        this.userPendingStoresFsRepository = userPendingStoresFsRepository;
        this.storesFsRepository = storesFsRepository;
        this.invitesFsRepository = invitesFsRepository;
        this.activeStoreServise = activeStoreServise;
        this.userStores = this.userStoresFsRepository.FormatedList;
        this.userPendingStores = this.userPendingStoresFsRepository.FormatedList;
    }
    UserStoresPage.prototype.createNewStore = function () {
        var _this = this;
        return this.auth.user.pipe(operators_1.take(1)).subscribe(function (user) {
            return _this.storesFsRepository.createNewStore(user.uid);
        });
    };
    UserStoresPage.prototype.onStoreSelected = function (extStore) {
        this.activeStoreServise.setActiveStoreKey(extStore.id);
        //  const accountsPage = { title: "Accounts", component: "AccountsListPage" };
        this.router.navigateByUrl("/StoreBase");
    };
    UserStoresPage.prototype.ionViewDidLoad = function () {
        console.log("ionViewDidLoad UserStoresPage");
    };
    UserStoresPage.prototype.accept = function (inviteId) {
        this.invitesFsRepository.accpetInvite(inviteId);
    };
    UserStoresPage.prototype.reject = function (inviteId) {
        this.invitesFsRepository.rejectInvite(inviteId);
    };
    UserStoresPage.prototype.ngOnInit = function () { };
    UserStoresPage = __decorate([
        core_1.Component({
            selector: "app-user-stores",
            templateUrl: "./user-stores.page.html",
            styleUrls: ["./user-stores.page.scss"]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            auth_service_1.AuthService,
            user_stores_service_1.UserStoresService,
            user_pending_stores_service_1.UserPendingStoresService,
            store_info_service_1.StoreInfoService,
            invites_service_1.InvitesService,
            active_store_service_1.ActiveStoreService])
    ], UserStoresPage);
    return UserStoresPage;
}());
exports.UserStoresPage = UserStoresPage;
//# sourceMappingURL=user-stores.page.js.map