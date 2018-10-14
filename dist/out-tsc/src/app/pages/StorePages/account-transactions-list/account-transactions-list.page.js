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
var angular_1 = require("@ionic/angular");
var operators_1 = require("rxjs/operators");
var compare_timetamp_1 = require("../../../Util/compare-timetamp");
var transactions_data_service_1 = require("../../../providers/StoreData/transactions-data.service");
var accounts_data_service_1 = require("../../../providers/StoreData/accounts-data.service");
var router_1 = require("@angular/router");
var AccountTransactionsListPage = /** @class */ (function () {
    function AccountTransactionsListPage(route, 
    //  public navCtrl: NavController,
    //  public navParams: NavParams,
    alertController, transactionsRep, accountsRep, modalController) {
        var _this = this;
        this.route = route;
        this.alertController = alertController;
        this.transactionsRep = transactionsRep;
        this.accountsRep = accountsRep;
        this.modalController = modalController;
        // this.accountId = this.navParams.get("accountId");
        this.transSnapshots = this.route.paramMap.pipe(operators_1.switchMap(function (params) {
            // (+) before `params.get()` turns the string into a number
            _this.accountId = params.get("id");
            return _this.transactionsRep.forAccount(_this.accountId);
        }));
        this.transSnapshotsArray = this.transSnapshots.pipe(operators_1.map(function (m) {
            return m.toArray().sort(function (a, b) {
                return Date.parse(a.data.date) - Date.parse(b.data.date);
            });
        }));
        this.transSnapshotsArray.subscribe(console.log);
        this.extAccount = this.accountsRep.getExtended(this.accountId);
        this.transSnapshotsArray = this.transSnapshotsArray.pipe(operators_1.combineLatest(this.extAccount, function (extTranses, extAccount) {
            var currentBalance = extAccount.ext.$balanceObj.data
                ? extAccount.ext.$balanceObj.data.balance
                : 0;
            var transes = extTranses.sort(function (a, b) {
                return compare_timetamp_1.compareTimeStamp(a.data.date, b.data.date);
            });
            transes.forEach(function (trans) {
                trans.ext.currentBalance = currentBalance;
                currentBalance -= trans.data.type * trans.data.ammount;
            });
            return transes;
        }));
    }
    AccountTransactionsListPage.prototype.ionViewDidLoad = function () {
        console.log("ionViewDidLoad AccountTransactionsPage");
    };
    AccountTransactionsListPage.prototype.presentEditTransactionModal = function (transSnapshot) {
        //  this.navCtrl.push("EditTransactionPage", { transSnapshot });
    };
    AccountTransactionsListPage.prototype.showTransactionImage = function (transSnapshot) {
        /*
        if (transSnapshot.ext.imageFile) {
          let modal = this.modalController.create("PhotoDetailPage", {
            canDelete: false,
            canSelect: false,
            images: [transSnapshot.ext.imageFile]
          });
          modal.present();
        }
        */
    };
    AccountTransactionsListPage.prototype.ionViewDidEnter = function () {
        /*
        this.accountsRep.getOnce(this.accountId).then(extAccount => {
          if (this.titleService) {
            this.titleService.setNav(this.navCtrl);
            this.titleService.setTitle("حساب " + extAccount.data.name);
          }
        });
        */
    };
    AccountTransactionsListPage.prototype.onDelete = function (transSnapshot) {
        /*
        const alert = this.alertController.create({
          message: `Are u sure. deleting ${transSnapshot.data.ammount} Transaction`,
          title: "Deleting Transaction",
          buttons: [
            {
              text: "Ok",
              handler: () => {
                this.transactionsRep.remove(transSnapshot);
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
    AccountTransactionsListPage.prototype.presentNewTransactionModal = function (type) {
        var date = new Date().toISOString();
        //    date = UTCToLocal(date)
        var newTransaction = {
            type: type,
            accountId: this.accountId,
            date: date
        };
        return this.presentEditTransactionModal({ id: null, data: newTransaction });
    };
    AccountTransactionsListPage.prototype.ngOnInit = function () { };
    AccountTransactionsListPage = __decorate([
        core_1.Component({
            selector: "app-account-transactions-list",
            templateUrl: "./account-transactions-list.page.html",
            styleUrls: ["./account-transactions-list.page.scss"]
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            angular_1.AlertController,
            transactions_data_service_1.TransactionsDataService,
            accounts_data_service_1.AccountsDataService,
            angular_1.ModalController])
    ], AccountTransactionsListPage);
    return AccountTransactionsListPage;
}());
exports.AccountTransactionsListPage = AccountTransactionsListPage;
//# sourceMappingURL=account-transactions-list.page.js.map