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
var rxjs_1 = require("rxjs");
var ActiveStoreService = /** @class */ (function () {
    function ActiveStoreService() {
        this._activeStoreKey = "HW1TAwI2hz0pLNINa51Q";
        this.subject = new rxjs_1.BehaviorSubject("HW1TAwI2hz0pLNINa51Q");
        this._activeStoreKey$ = this.subject.asObservable();
    }
    Object.defineProperty(ActiveStoreService.prototype, "activeStoreKey", {
        get: function () {
            return this._activeStoreKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActiveStoreService.prototype, "activeStoreKey$", {
        get: function () {
            return this._activeStoreKey$;
        },
        enumerable: true,
        configurable: true
    });
    ActiveStoreService.prototype.getReactivePath = function (subPath) {
    };
    ActiveStoreService.prototype.setDefaultStoreKey = function (newKey) {
        window.localStorage.setItem("DEFAULT_STORE", newKey);
    };
    ActiveStoreService.prototype.getDefaultStoreKey = function () {
        return window.localStorage.getItem("DEFAULT_STORE");
    };
    ActiveStoreService.prototype.setActiveStoreKey = function (newKey) {
        if (newKey !== this._activeStoreKey) {
            this._activeStoreKey = newKey;
            //  this.setDefaultStoreKey(newKey);
            this.subject.next(newKey);
        }
    };
    ActiveStoreService.prototype.clearActiveStoreKey = function () {
        return this.setActiveStoreKey(null);
    };
    ActiveStoreService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [])
    ], ActiveStoreService);
    return ActiveStoreService;
}());
exports.ActiveStoreService = ActiveStoreService;
//# sourceMappingURL=active-store.service.js.map