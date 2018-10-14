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
var accounts_data_service_1 = require("../../../providers/StoreData/accounts-data.service");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var forms_1 = require("@angular/forms");
var EditAccountPage = /** @class */ (function () {
    function EditAccountPage(location, afsr, rout, fb) {
        var _this = this;
        this.location = location;
        this.afsr = afsr;
        this.rout = rout;
        this.fb = fb;
        this.submitAttempt = false;
        this.account$ = this.rout.paramMap.pipe(operators_1.switchMap(function (data) {
            _this.accountId = data.get("id");
            if (_this.accountId !== "new") {
                return _this.afsr.get(_this.accountId);
            }
            else {
                _this.accountId = null;
                return rxjs_1.of({ id: null, data: {} });
            }
        }));
        this.form = this.fb.group({
            name: [
                "",
                forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.maxLength(50)])
            ],
            city: "",
            mobile: ""
        });
        this.account$ =
            this.account$.pipe(operators_1.tap(function (account) {
                if (account) {
                    _this.accountName = account.data.name;
                    _this.form.patchValue(account.data);
                }
            }));
        //  console.log(this.accSnapshot);
        //  this.accountId = this.accSnapshot.id;
    }
    Object.defineProperty(EditAccountPage.prototype, "nameControl", {
        get: function () {
            return this.form.get("name");
        },
        enumerable: true,
        configurable: true
    });
    EditAccountPage.prototype.onSubmit = function (_a) {
        var value = _a.value, valid = _a.valid;
        console.log(value, valid);
        this.submitAttempt = true;
        if (valid) {
            this.onSave(value);
        }
        // throw "please take care , invalid form"
    };
    EditAccountPage.prototype.ionViewDidLoad = function () {
        console.log("ionViewDidLoad EditAccountPage");
    };
    EditAccountPage.prototype.dismiss = function (data) {
        // let data = { account: this.account };
        this.location.back();
    };
    EditAccountPage.prototype.onCancel = function () {
        return this.dismiss(null);
    };
    EditAccountPage.prototype.prepairForSave = function (value) {
        return { id: this.accountId, data: value };
    };
    EditAccountPage.prototype.onSave = function (accSnapshot) {
        var extendedAccount = this.prepairForSave(accSnapshot);
        if (!this.accountId) {
            this.afsr.saveNew(extendedAccount);
            this.dismiss(extendedAccount);
        }
        else {
            this.afsr.saveOld(extendedAccount);
            this.dismiss(extendedAccount);
        }
    };
    EditAccountPage.prototype.ngOnInit = function () { };
    EditAccountPage = __decorate([
        core_1.Component({
            selector: "app-edit-account",
            templateUrl: "./edit-account.page.html",
            styleUrls: ["./edit-account.page.scss"]
        }),
        __metadata("design:paramtypes", [common_1.Location,
            accounts_data_service_1.AccountsDataService,
            router_1.ActivatedRoute,
            forms_1.FormBuilder])
    ], EditAccountPage);
    return EditAccountPage;
}());
exports.EditAccountPage = EditAccountPage;
//# sourceMappingURL=edit-account.page.js.map