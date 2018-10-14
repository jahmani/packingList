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
var operators_1 = require("rxjs/operators");
var compare_timetamp_1 = require("../../Util/compare-timetamp");
var accounts_data_service_1 = require("./accounts-data.service");
var images_data_service_1 = require("./images-data.service");
var OrdersDataService = /** @class */ (function (_super) {
    __extends(OrdersDataService, _super);
    function OrdersDataService(afs, activeStoreService, accountsRep, imagesFsRepository) {
        var _this = _super.call(this, afs, activeStoreService, StorePathConfig_1.StorePathConfig.Orders) || this;
        _this.accountsRep = accountsRep;
        _this.imagesFsRepository = imagesFsRepository;
        console.log("Hello TransactionsFsRepository Provider");
        return _this;
    }
    OrdersDataService.prototype.forAccount = function (accountKey) {
        var OrdersColl = this.afs.collection(this.collection.ref.path, function (ref) {
            return ref.where("accountId", "==", accountKey);
        });
        // const transactionsList = super.snapList(transactionsColl);
        var ordersMap = _super.prototype.snapshotMap.call(this, OrdersColl.snapshotChanges());
        // return transactionsMap
        return ordersMap;
    };
    OrdersDataService.prototype.getExtended = function (key) {
        var _this = this;
        return _super.prototype.get.call(this, key).pipe(operators_1.mergeMap(function (order) {
            return _this.accountsRep.get(order.data.accountId).pipe(operators_1.map(function (extAccount) {
                order.ext = order.ext || {};
                order.ext.account = extAccount;
                return order;
            }));
        }));
    };
    Object.defineProperty(OrdersDataService.prototype, "FormatedList", {
        get: function () {
            return this.List().pipe(
            /*  */
            operators_1.combineLatest(this.accountsRep.dataMap, function (orders, accountsMap) {
                orders.forEach(function (order) {
                    order.ext = order.ext || {};
                    order.ext.account = accountsMap.get(order.data.accountId);
                });
                return orders;
            }), operators_1.map(function (ordersArray) {
                return ordersArray.sort(function (a, b) {
                    return compare_timetamp_1.compareTimeStamp(a.ext.$computedLastEditedOn, b.ext.$computedLastEditedOn);
                });
            }));
        },
        enumerable: true,
        configurable: true
    });
    OrdersDataService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [firestore_1.AngularFirestore,
            active_store_service_1.ActiveStoreService,
            accounts_data_service_1.AccountsDataService,
            images_data_service_1.ImagesDataService])
    ], OrdersDataService);
    return OrdersDataService;
}(store_data_service_1.StoreDataService));
exports.OrdersDataService = OrdersDataService;
//# sourceMappingURL=orders-data.service.js.map