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
var firebase_1 = require("firebase");
var AccountsBalanceService = /** @class */ (function (_super) {
    __extends(AccountsBalanceService, _super);
    function AccountsBalanceService(afs, activeStoreService) {
        var _this = _super.call(this, afs, activeStoreService, StorePathConfig_1.StorePathConfig.AccountsBalance) || this;
        _this.activeStoreService = activeStoreService;
        //    super(af,activeStoreInfoService.ActiveStoreAccountsBalanceReference)
        console.log("Helloooooo AccountsBalance FBRepository Provider");
        return _this;
    }
    Object.defineProperty(AccountsBalanceService.prototype, "FormatedList", {
        get: function () {
            return this.List();
        },
        enumerable: true,
        configurable: true
    });
    AccountsBalanceService.prototype.setAccountBalanceInvalid = function (accountId) {
        var invalidFlagpath = "/versions/v4/stores/" + this.activeStoreService.activeStoreKey + "/accountsBalance/" + accountId + "/flags/invalid";
        var invalidFlagRef = firebase_1.firestore().doc(invalidFlagpath);
        firebase_1.firestore().runTransaction(function (dbTransaction) {
            return dbTransaction
                .get(invalidFlagRef)
                .then(function (docSnapShot) {
                if (docSnapShot.exists) {
                    return;
                }
                else {
                    dbTransaction.set(invalidFlagRef, { invalid: true });
                }
            })
                .then(function () {
                console.log("setAccountBalanceInvalid Transaction successfully committed!");
            })
                .catch(function (error) {
                console.log("setAccountBalanceInvalid Transaction failed: ", error);
            });
        });
    };
    AccountsBalanceService.prototype.setAccountBalanceDirty = function (accountId, transactionID) {
        var _this = this;
        return this.getOrCreate(accountId).then(function (extBalance) {
            var isNewBalanceDoc = false;
            if (!extBalance.data) {
                extBalance.data = {};
                isNewBalanceDoc = true;
            }
            if (extBalance.data.isDirty) {
                return Promise.reject("balance already dirty");
            }
            extBalance.data.isDirty = true;
            extBalance.data.lastTransactionId = transactionID;
            return isNewBalanceDoc
                ? _this.saveNew(extBalance, extBalance.id)
                : _this.saveOld(extBalance);
        });
    };
    AccountsBalanceService.prototype.updateAccountBalanceAmmount = function (accountId, deltaAmmount) {
        var _this = this;
        return this.getOnce(accountId).then(function (extBalance) {
            if (!extBalance.data || !extBalance.data.isDirty) {
                return Promise.reject("balance is not dirty");
            }
            extBalance.data.isDirty = false;
            if (isNaN(extBalance.data.balance)) {
                extBalance.data.balance = 0;
            }
            extBalance.data.balance += deltaAmmount;
            return _this.saveOld(extBalance);
        });
    };
    AccountsBalanceService.prototype.getUpdateBalanceObject = function (accountId, deltaAmmount, transactionID) {
        /*
        return this.get(accountId).first().toPromise().then(accountBalance => {
          let updatesObject = {};
          if (!(<any>accountBalance).$exists()) {
            accountBalance = new AccountBalance();
            accountBalance.balance = deltaAmmount;
            accountBalance.lastEditedTransactionId = transactionID;
            updatesObject = this.getSaveNewObject(accountBalance, accountId);
    
          }
          else {
            accountBalance.balance *= 1;
            accountBalance.balance += 1 * deltaAmmount;
            accountBalance.lastEditedTransactionId = transactionID;
            updatesObject = this.getSaveOldObject(accountBalance)
          }
          return updatesObject;
        })
        */
        throw new Error("not implemented ");
    };
    AccountsBalanceService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [firestore_1.AngularFirestore,
            active_store_service_1.ActiveStoreService])
    ], AccountsBalanceService);
    return AccountsBalanceService;
}(store_data_service_1.StoreDataService));
exports.AccountsBalanceService = AccountsBalanceService;
//# sourceMappingURL=accounts-balance.service.js.map