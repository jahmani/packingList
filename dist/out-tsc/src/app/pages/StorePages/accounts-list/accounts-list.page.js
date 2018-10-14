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
var forms_1 = require("@angular/forms");
var angular_1 = require("@ionic/angular");
var operators_1 = require("rxjs/operators");
var accounts_data_service_1 = require("../../../providers/StoreData/accounts-data.service");
var AccountsListPage = /** @class */ (function () {
    function AccountsListPage(accountsDataService, modalController) {
        this.accountsDataService = accountsDataService;
        this.modalController = modalController;
        //  this.accountsFsRepository = this.accountsFsRepository;
        this.accounts = this.accountsDataService.FormatedList;
        this.searchControl = new forms_1.FormControl();
        this.accounts.subscribe(console.log);
    }
    AccountsListPage.prototype.ionViewDidLoad = function () {
        // searchControl.valueChanges will not emit values untill the user make input
        // combineLatest will not emit values untill both ovseravables emit values
        //
        var initializedValueChanges = this.searchControl.valueChanges
            .pipe(operators_1.debounceTime(700))
            .pipe(operators_1.startWith(null));
        /*
        merged.subscribe(searcTerm => {
          console.log("merge Eimit", searcTerm)
        })
        */
        this.filteredAccounts = rxjs_1.combineLatest(initializedValueChanges, this.accounts, function (searcTerm, extAccounts) {
            if (!searcTerm || !searcTerm.length) {
                return extAccounts;
            }
            return extAccounts.filter(function (extAccount) {
                return (extAccount.data.name.includes(searcTerm) ||
                    extAccount.data.city.includes(searcTerm));
            });
        });
        this.totalBalanceObj = this.filteredAccounts.pipe(operators_1.map(function (extAccounts) {
            return extAccounts.reduce(function (prev, curr) {
                prev.balance += curr.ext.$balance ? curr.ext.$balance : 0;
                if (curr.ext.$balanceObj && curr.ext.$balanceObj.data.isDirty) {
                    prev.isDirty = true;
                }
                return prev;
            }, { balance: 0, isDirty: false });
        }));
    };
    AccountsListPage.prototype.onClick = function (extAccount) {
        /*
        const canSelect = this.navParams.get("canSelect");
        if (canSelect) {
          this.selectAccount(extAccount);
        } else {
          this.showAccountTransactions(extAccount);
        }
        */
    };
    AccountsListPage.prototype.showAccountTransactions = function (accSnapshot) {
        //  this.navCtrl.push("AccountTransactionsPage", { accountId: accSnapshot.id });
    };
    AccountsListPage.prototype.selectAccount = function (extAccount) {
        /*
        const callBack = this.navParams.get("callBack");
        callBack(extAccount).then(() => {
          //  this.navCtrl.pop();
        });
        // this.viewCtrl.dismiss(extAccount)
        */
    };
    AccountsListPage.prototype.invalidateBalance = function (accSnapshot) {
        if (accSnapshot.ext.$balanceObj.data.isDirty) {
            return this.accountsDataService.setAccountBalanceInvalid(accSnapshot.id);
        }
    };
    AccountsListPage.prototype.presentEditAccountModal = function (accSnapshot) {
        //  this.navCtrl.push("EditAccountPage", { accSnapshot });
    };
    AccountsListPage.prototype.presentNewAccountModal = function () {
        return this.presentEditAccountModal({ id: null, data: {} });
    };
    AccountsListPage.prototype.onDelete = function (accSnapshot) {
        /*
        const alert = this.alertController.create({
          message: `Are u sure. deleting ${accSnapshot.data.name} information`,
          title: "Deleting AccountInfo Info",
          buttons: [
            {
              text: "Ok",
              handler: () => {
                this.accountsFsRepository.remove(accSnapshot);
              }
            },
            {
              text: "Cancel"
            }
          ]
        });
        alert.present();
        */
    };
    AccountsListPage.prototype.ionViewDidEnter = function () { };
    AccountsListPage.prototype.ngOnInit = function () { };
    AccountsListPage = __decorate([
        core_1.Component({
            selector: "app-accounts-list",
            templateUrl: "./accounts-list.page.html",
            styleUrls: ["./accounts-list.page.scss"]
        }),
        __metadata("design:paramtypes", [accounts_data_service_1.AccountsDataService,
            angular_1.ModalController])
    ], AccountsListPage);
    return AccountsListPage;
}());
exports.AccountsListPage = AccountsListPage;
//# sourceMappingURL=accounts-list.page.js.map