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
var forms_1 = require("@angular/forms");
var auth_service_1 = require("../../providers/Auth/auth.service");
var router_1 = require("@angular/router");
var SignupPage = /** @class */ (function () {
    function SignupPage(fb, auth, router) {
        this.fb = fb;
        this.auth = auth;
        this.router = router;
        this.submitAttempt = false;
        this.form = this.fb.group({
            email: ["", forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.email])],
            password: ["", forms_1.Validators.required]
        });
    }
    SignupPage.prototype.ionViewDidLoad = function () {
        console.log("ionViewDidLoad SignupPage");
    };
    SignupPage.prototype.onSubmit = function (_a) {
        var _this = this;
        var value = _a.value, valid = _a.valid;
        console.log(value, valid);
        this.submitAttempt = true;
        if (valid) {
            this.auth
                .signupUser(value.email, value.password)
                .then(function () { return _this.router.navigateByUrl("home"); });
        }
        // throw "please take care , invalid form"
    };
    SignupPage.prototype.ngOnInit = function () { };
    SignupPage = __decorate([
        core_1.Component({
            selector: "app-signup",
            templateUrl: "./signup.page.html",
            styleUrls: ["./signup.page.scss"]
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder,
            auth_service_1.AuthService,
            router_1.Router])
    ], SignupPage);
    return SignupPage;
}());
exports.SignupPage = SignupPage;
//# sourceMappingURL=signup.page.js.map