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
var firestore_1 = require("@angular/fire/firestore");
var firestore_data_1 = require("./firestore-data");
var StorePathConfig_1 = require("../../interfaces/StorePathConfig");
var first_1 = require("rxjs/internal/operators/first");
var UsersService = /** @class */ (function (_super) {
    __extends(UsersService, _super);
    function UsersService(afs) {
        var _this = _super.call(this, afs, StorePathConfig_1.StorePathConfig.Users) || this;
        _this.afs = afs;
        return _this;
    }
    UsersService.prototype.getByEmail = function (email) {
        var encodedEmal = email.replace(".", "|");
        return this.afs
            .doc(StorePathConfig_1.StorePathConfig.usersByEmail + ("/" + encodedEmal))
            .valueChanges()
            .pipe(first_1.first())
            .toPromise();
    };
    UsersService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [firestore_1.AngularFirestore])
    ], UsersService);
    return UsersService;
}(firestore_data_1.FirestoreData));
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map