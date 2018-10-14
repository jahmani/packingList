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
var LoginPage = /** @class */ (function () {
    function LoginPage(fb, auth, router) {
        this.fb = fb;
        this.auth = auth;
        this.router = router;
        this.submitAttempt = false;
        this.form = this.fb.group({
            email: ["", forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.email])],
            password: ""
        });
    }
    LoginPage.prototype.ionViewDidLoad = function () {
        console.log("ionViewDidLoad LoginPage");
    };
    LoginPage.prototype.onSubmit2 = function (_a) {
        var _this = this;
        var value = _a.value, valid = _a.valid;
        console.log(value, valid);
        this.submitAttempt = true;
        if (valid) {
            this.auth
                .signInWithEmail(value.email, value.password)
                .then(function () { return _this.router.navigateByUrl("home"); });
        }
        // throw "please take care , invalid form"
    };
    LoginPage.prototype.ngOnInit = function () { };
    LoginPage = __decorate([
        core_1.Component({
            selector: "app-login",
            templateUrl: "./login.page.html",
            styleUrls: ["./login.page.scss"]
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder,
            auth_service_1.AuthService,
            router_1.Router])
    ], LoginPage);
    return LoginPage;
}());
exports.LoginPage = LoginPage;
//# sourceMappingURL=login.page.js.map