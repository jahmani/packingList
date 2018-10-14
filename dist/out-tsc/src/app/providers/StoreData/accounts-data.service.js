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
var store_data_service_1 = require("./store-data.service");
var firestore_1 = require("@angular/fire/firestore");
var active_store_service_1 = require("../AppData/active-store.service");
var StorePathConfig_1 = require("../../interfaces/StorePathConfig");
var rxjs_1 = require("rxjs");
var compare_timetamp_1 = require("../../Util/compare-timetamp");
var operators_1 = require("rxjs/operators");
var accounts_balance_service_1 = require("./accounts-balance.service");
var AccountsDataService = /** @class */ (function (_super) {
    __extends(AccountsDataService, _super);
    function AccountsDataService(afs, activeStoreService, accountsBalanceFBRepository) {
        var _this = _super.call(this, afs, activeStoreService, StorePathConfig_1.StorePathConfig.AccountsInfo) || this;
        _this.accountsBalanceFBRepository = accountsBalanceFBRepository;
        console.log("Hello AccountsFBRepository Provider");
        return _this;
    }
    Object.defineProperty(AccountsDataService.prototype, "FormatedList", {
        get: function () {
            return rxjs_1.combineLatest(this.accountsBalanceFBRepository.dataMap, this.List())
                .pipe(operators_1.map(function (_a) {
                var balancesMap = _a[0], accounts = _a[1];
                accounts.forEach(function (account) {
                    account.ext = account.ext || {};
                    account.ext.$balance = 0;
                    account.ext.$computedLastEditedOn = account.data.lastEditedOn;
                    var balanceObj = balancesMap.get(account.id);
                    if (balanceObj) {
                        account.ext.$balanceObj = balanceObj;
                        account.ext.$balance = balanceObj.data.balance;
                        if (compare_timetamp_1.compareTimeStamp(account.ext.$computedLastEditedOn, balanceObj.data.lastEditedOn) > 0) {
                            account.ext.$computedLastEditedOn =
                                balanceObj.data.lastEditedOn;
                        }
                        //   if (balanceObj.lastEditedDate > account.$computedLastEditDate)
                        //     account.$computedLastEditDate = balanceObj.lastEditedDate;
                    }
                });
                return accounts;
            }))
                .pipe(operators_1.map(function (accountsArray) {
                return accountsArray.sort(function (a, b) {
                    return compare_timetamp_1.compareTimeStamp(a.ext.$computedLastEditedOn, b.ext.$computedLastEditedOn);
                });
            }));
        },
        enumerable: true,
        configurable: true
    });
    AccountsDataService.prototype.setAccountBalanceInvalid = function (accountId) {
        return this.accountsBalanceFBRepository.setAccountBalanceInvalid(accountId);
    };
    AccountsDataService.prototype.getExtended = function (accountId) {
        var account = _super.prototype.get.call(this, accountId);
        var balance = this.accountsBalanceFBRepository.get(accountId);
        var extended = rxjs_1.combineLatest(account, balance, function (extAccount, extBalance) {
            extAccount.ext = extAccount.ext || {};
            extAccount.ext.$balanceObj = extBalance;
            return extAccount;
        });
        return extended;
    };
    AccountsDataService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [firestore_1.AngularFirestore,
            active_store_service_1.ActiveStoreService,
            accounts_balance_service_1.AccountsBalanceService])
    ], AccountsDataService);
    return AccountsDataService;
}(store_data_service_1.StoreDataService));
exports.AccountsDataService = AccountsDataService;
//# sourceMappingURL=accounts-data.service.js.map