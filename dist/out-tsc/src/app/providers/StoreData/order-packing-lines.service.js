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
var orders_data_service_1 = require("./orders-data.service");
var products_data_service_1 = require("./products-data.service");
var OrderPackingLinesService = /** @class */ (function (_super) {
    __extends(OrderPackingLinesService, _super);
    function OrderPackingLinesService(afs, activeStoreService, ordersRep, productsRep) {
        var _this = _super.call(this, afs, activeStoreService, StorePathConfig_1.StorePathConfig.OrderPLLines) || this;
        _this.ordersRep = ordersRep;
        _this.productsRep = productsRep;
        console.log("Hello OrderPLLinesPLLinesFsRepository Provider");
        return _this;
    }
    OrderPackingLinesService.prototype.forOrder = function (orderKey) {
        var OrderPLLinesColl = this.afs.collection(this.collection.ref.path, function (ref) { return ref.where("orderId", "==", orderKey); });
        // const transactionsList = super.snapList(transactionsColl);
        var orderPLLinesMap = _super.prototype.snapList.call(this, OrderPLLinesColl.snapshotChanges());
        // return transactionsMap
        return this.formateList(orderPLLinesMap);
    };
    Object.defineProperty(OrderPackingLinesService.prototype, "FormatedList", {
        get: function () {
            return this.formateList(this.List());
        },
        enumerable: true,
        configurable: true
    });
    OrderPackingLinesService.prototype.formateList = function (list) {
        return list.pipe(
        /*  */
        operators_1.combineLatest(this.productsRep.dataMap, function (orderPLLines, productsMap) {
            orderPLLines.forEach(function (orderPLLine) {
                orderPLLine.ext = orderPLLine.ext || {};
                orderPLLine.ext.Product = productsMap.get(orderPLLine.data.productId);
            });
            return orderPLLines;
        }), operators_1.map(function (orderPLLinesArray) {
            return orderPLLinesArray.sort(function (a, b) {
                return compare_timetamp_1.compareTimeStamp(a.ext.$computedLastEditedOn, b.ext.$computedLastEditedOn);
            });
        }));
    };
    OrderPackingLinesService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [firestore_1.AngularFirestore,
            active_store_service_1.ActiveStoreService,
            orders_data_service_1.OrdersDataService,
            products_data_service_1.ProductsDataService])
    ], OrderPackingLinesService);
    return OrderPackingLinesService;
}(store_data_service_1.StoreDataService));
exports.OrderPackingLinesService = OrderPackingLinesService;
//# sourceMappingURL=order-packing-lines.service.js.map