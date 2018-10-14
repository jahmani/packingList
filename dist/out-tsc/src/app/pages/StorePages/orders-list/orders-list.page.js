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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angular_1 = require("@ionic/angular");
var orders_data_service_1 = require("../../../providers/StoreData/orders-data.service");
var router_1 = require("@angular/router");
var photo_view_component_1 = require("../../../shared/photo-view/photo-view.component");
var OrdersListPage = /** @class */ (function () {
    function OrdersListPage(router, ordersRep, route, alertController, modalController) {
        this.router = router;
        this.ordersRep = ordersRep;
        this.route = route;
        this.alertController = alertController;
        this.modalController = modalController;
        this.orders = this.ordersRep.FormatedList;
        /*
        this.orders.pipe(tap((orders)=>{
          console.log("orderssssssssss")
          console.log(orders)
        }))
        */
    }
    OrdersListPage.prototype.ionViewDidLoad = function () {
        console.log("ionViewDidLoad OrdersListPage");
    };
    OrdersListPage.prototype.delete = function (extOrder) {
        return __awaiter(this, void 0, void 0, function () {
            var modal;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            message: "Are you sure deleting order: ",
                            header: "Deleteing Order",
                            buttons: [
                                {
                                    text: "Delete",
                                    handler: function () {
                                        _this.ordersRep.remove(extOrder);
                                    }
                                },
                                { text: "cancel", cssClass: "danger" }
                            ]
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal
                                .present()
                                .then(function (val) {
                                console.log("val", val);
                            })
                                .catch(console.log)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OrdersListPage.prototype.presentEditOrderModal = function (orderId) {
        // this.navCtrl.push("EditOrderPage", { orderId });
    };
    OrdersListPage.prototype.showOrderImage = function (orderSnapshot) {
        return __awaiter(this, void 0, void 0, function () {
            var modal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!orderSnapshot.ext.imageFile) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.modalController.create({
                                component: photo_view_component_1.PhotoViewComponent,
                                componentProps: {
                                    canDelete: false,
                                    canSelect: false,
                                    images: [orderSnapshot.data.imageUrl]
                                }
                            })];
                    case 1:
                        modal = _a.sent();
                        modal.present();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    OrdersListPage.prototype.onDelete = function (orderSnapshot) {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            message: "Are u sure. deleting " + orderSnapshot.data.accountId + " Order",
                            header: "Deleting Order",
                            buttons: [
                                {
                                    text: "Ok",
                                    handler: function () {
                                        _this.ordersRep.remove(orderSnapshot);
                                    }
                                },
                                {
                                    text: "Cancel"
                                }
                            ]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OrdersListPage.prototype.presentNewOrderModal = function () {
        var date = new Date().toISOString();
        //    date = UTCToLocal(date)
        return this.presentEditOrderModal();
    };
    OrdersListPage.prototype.ngOnInit = function () { };
    OrdersListPage = __decorate([
        core_1.Component({
            selector: "app-orders-list",
            templateUrl: "./orders-list.page.html",
            styleUrls: ["./orders-list.page.scss"]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            orders_data_service_1.OrdersDataService,
            router_1.ActivatedRoute,
            angular_1.AlertController,
            angular_1.ModalController])
    ], OrdersListPage);
    return OrdersListPage;
}());
exports.OrdersListPage = OrdersListPage;
//# sourceMappingURL=orders-list.page.js.map