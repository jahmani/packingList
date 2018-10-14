"use strict";
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
var forms_1 = require("@angular/forms");
var active_store_service_1 = require("../../providers/AppData/active-store.service");
var store_info_service_1 = require("../../providers/AppData/store-info.service");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var operators_1 = require("rxjs/operators");
var EditStoreInfoPage = /** @class */ (function () {
    function EditStoreInfoPage(fb, storesFsRepository, activeStoreService, router, location, rout) {
        var _this = this;
        this.fb = fb;
        this.storesFsRepository = storesFsRepository;
        this.activeStoreService = activeStoreService;
        this.router = router;
        this.location = location;
        this.rout = rout;
        this.submitAttempt = false;
        this.form = this.fb.group({
            name: [
                "",
                forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(3)])
            ],
            currency: ["", forms_1.Validators.compose([forms_1.Validators.required])]
        });
        var paramStoreId = this.rout.snapshot.paramMap.get("id");
        if (!paramStoreId) {
            var activeStoreId = this.activeStoreService.activeStoreKey;
            router.navigate(["/EditStoreInfo", activeStoreId], { replaceUrl: true });
        }
        this.storeId = paramStoreId;
        this.storeDoc$ = this.storesFsRepository.get(this.storeId).pipe(operators_1.tap(function (str) {
            _this.storeDoc = str;
            _this.form.patchValue(_this.storeDoc.data);
        }));
    }
    Object.defineProperty(EditStoreInfoPage.prototype, "nameCtrl", {
        get: function () {
            return this.form.get("name");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditStoreInfoPage.prototype, "currencyCtrl", {
        get: function () {
            return this.form.get("currency");
        },
        enumerable: true,
        configurable: true
    });
    EditStoreInfoPage.prototype.onSubmit = function (_a) {
        var _this = this;
        var value = _a.value, valid = _a.valid;
        if (valid) {
            var updatedStoreDoc = __assign({}, this.storeDoc, { data: __assign({}, value) });
            return this.storesFsRepository.saveOld(updatedStoreDoc).then(function () {
                _this.location.back();
            });
        }
    };
    EditStoreInfoPage.prototype.onCancel = function () {
        this.location.back();
    };
    EditStoreInfoPage = __decorate([
        core_1.Component({
            selector: "app-edit-store-info",
            templateUrl: "./edit-store-info.page.html",
            styleUrls: ["./edit-store-info.page.scss"]
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder,
            store_info_service_1.StoreInfoService,
            active_store_service_1.ActiveStoreService,
            router_1.Router,
            common_1.Location,
            router_1.ActivatedRoute])
    ], EditStoreInfoPage);
    return EditStoreInfoPage;
}());
exports.EditStoreInfoPage = EditStoreInfoPage;
//# sourceMappingURL=edit-store-info.page.js.map