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
var images_data_service_1 = require("./images-data.service");
var transaction_cats_data_service_1 = require("./transaction-cats-data.service");
var accounts_balance_service_1 = require("./accounts-balance.service");
var operators_1 = require("rxjs/operators");
var TransactionsDataService = /** @class */ (function (_super) {
    __extends(TransactionsDataService, _super);
    function TransactionsDataService(afs, activeStoreService, imagesFsRepository, tCatFsRep, balanceFsRep) {
        var _this = _super.call(this, afs, activeStoreService, StorePathConfig_1.StorePathConfig.Transactions) || this;
        _this.imagesFsRepository = imagesFsRepository;
        _this.tCatFsRep = tCatFsRep;
        _this.balanceFsRep = balanceFsRep;
        console.log('Hello TransactionsFsRepository Provider');
        return _this;
    }
    TransactionsDataService.prototype.forAccount = function (accountKey) {
        var _this = this;
        var transactionsColl$ = this.path$.pipe(operators_1.map(function (path) {
            return _this.afs.collection(path, function (ref) { return ref.where('accountId', '==', accountKey); });
        }));
        // const transactionsList = super.snapList(transactionsColl);
        var transactionsMap = transactionsColl$.pipe(operators_1.switchMap(function (transactionsColl) {
            return _super.prototype.snapshotMap.call(_this, transactionsColl.snapshotChanges());
        }));
        // return transactionsMap
        return this.extendedDataMap(transactionsMap);
    };
    TransactionsDataService.prototype.extendedDataMap = function (transactionsMap) {
        var extendedTranses = rxjs_1.combineLatest(transactionsMap, this.tCatFsRep.dataMap, this.imagesFsRepository.dataMap, function (transs, cats, images) {
            transs.forEach(function (trans) {
                trans.ext = trans.ext || {};
                trans.ext.catigory = cats.get(trans.data.catigoryId);
                if (trans.data.imageSrc && !trans.data.imageSrc.includes("//")) {
                    trans.ext.imageFile = images.get(trans.data.imageSrc);
                }
            });
            return transs;
        });
        return extendedTranses;
    };
    TransactionsDataService.prototype.beforeTransactionUpdated = function (oldTransaction, newTransaction, newId) {
        var accountId = oldTransaction ? oldTransaction.data.accountId : newTransaction.data.accountId;
        var transactionId = oldTransaction ? oldTransaction.id : newId;
        var deltaAmmount = this.computeDeltaAmmount(oldTransaction, newTransaction);
        if (deltaAmmount !== 0) {
            return this.balanceFsRep.setAccountBalanceDirty(accountId, transactionId);
        }
        else {
            return Promise.resolve();
        }
    };
    TransactionsDataService.prototype.saveNew = function (newItem, id) {
        var _this = this;
        id = id || this.newKey();
        return this.beforeTransactionUpdated(null, newItem, id).then(function () {
            return _super.prototype.saveNew.call(_this, newItem, id).then(function () {
                return _this.afterTransactionUpdated(null, newItem);
            });
        });
    };
    TransactionsDataService.prototype.saveOld = function (editedItem) {
        var _this = this;
        return this.getOnce(editedItem.id).then(function (oldItem) {
            return _this.beforeTransactionUpdated(oldItem, editedItem).then(function () {
                return _super.prototype.saveOld.call(_this, editedItem).then(function () {
                    return _this.afterTransactionUpdated(oldItem, editedItem);
                });
            });
        });
    };
    TransactionsDataService.prototype.remove = function (removedItem) {
        var _this = this;
        return this.beforeTransactionUpdated(removedItem, null).then(function () {
            return _super.prototype.remove.call(_this, removedItem).then(function () {
                return _this.afterTransactionUpdated(removedItem, null);
            });
        });
    };
    TransactionsDataService.prototype.afterTransactionUpdated = function (oldTransaction, newTransaction) {
        var accountId = oldTransaction ? oldTransaction.data.accountId : newTransaction.data.accountId;
        var deltaAmmount = this.computeDeltaAmmount(oldTransaction, newTransaction);
        if (deltaAmmount !== 0) {
            return this.balanceFsRep.updateAccountBalanceAmmount(accountId, deltaAmmount);
        }
        else {
            return Promise.resolve();
        }
    };
    TransactionsDataService.prototype.computeDeltaAmmount = function (oldTransaction, newTransaction) {
        var oldAmmount = oldTransaction ? oldTransaction.data.ammount * oldTransaction.data.type : 0;
        var newAmmount = newTransaction ? newTransaction.data.ammount * newTransaction.data.type : 0;
        var deltaAmmount = newAmmount - oldAmmount;
        return deltaAmmount;
    };
    TransactionsDataService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [firestore_1.AngularFirestore,
            active_store_service_1.ActiveStoreService,
            images_data_service_1.ImagesDataService,
            transaction_cats_data_service_1.TransactionCatsDataService,
            accounts_balance_service_1.AccountsBalanceService])
    ], TransactionsDataService);
    return TransactionsDataService;
}(store_data_service_1.StoreDataService));
exports.TransactionsDataService = TransactionsDataService;
//# sourceMappingURL=transactions-data.service.js.map