import { Component, OnInit, Optional, ViewChild } from "@angular/core";
import { Observable, combineLatest } from "rxjs";
import {
  Extended,
  AccountInfo,
  AccountBalance
} from "../../interfaces/data-models";
import { FormControl } from "@angular/forms";
import { NavParams, ModalController } from "@ionic/angular";
import { debounceTime, startWith, map, tap } from "rxjs/operators";
import { AccountsDataService } from "../../providers/StoreData/accounts-data.service";
// import { UserStoresService } from "../../providers/AppData/user-stores.service";
import { Router } from "@angular/router";
import { EditAccountPage } from "../edit-account/edit-account.page";

@Component({
  selector: "app-accounts-list",
  templateUrl: "./accounts-list.page.html",
  styleUrls: ["./accounts-list.page.scss"]
})
export class AccountsListPage implements OnInit {
  accounts: Observable<Extended<AccountInfo>[]>;
  filteredAccounts: Observable<Extended<AccountInfo>[]>;
  searchControl: FormControl;
  totalBalanceObj: Observable<AccountBalance>;
  canSelect: any;
  @ViewChild("dynamicList") dynamicList;

  constructor(
    public accountsDataService: AccountsDataService,
    private modalController: ModalController,
    @Optional() private navParams: NavParams,
    private router: Router
  ) {
    //  this.accountsFsRepository = this.accountsFsRepository;
    this.accounts = this.accountsDataService.FormatedList.pipe(
      tap(accounts => {
        console.log(accounts);
      })
    );
    this.searchControl = new FormControl();
  }
  ionViewDidLoad() {
    // searchControl.valueChanges will not emit values untill the user make input
    // combineLatest will not emit values untill both ovseravables emit values

    const initializedValueChanges = this.searchControl.valueChanges
      .pipe(debounceTime(700),
      map((v) => (v + "").trim()),
      startWith(""),
    tap(console.log));

    this.filteredAccounts = combineLatest(
      initializedValueChanges,
      this.accounts
    ).pipe(
      map(([searcTerm, extAccounts]) => {
        if (!searcTerm || !searcTerm.length) {
          return extAccounts;
        }
        return extAccounts.filter(extAccount => {
          return (
            extAccount.data.name.toUpperCase().includes(searcTerm.toUpperCase()) ||
            extAccount.data.city.toUpperCase().includes(searcTerm.toUpperCase())
          );
        });
      })
    );

    this.totalBalanceObj = this.filteredAccounts.pipe(
      map(extAccounts => {
        return extAccounts.reduce(
          (prev, curr) => {
            prev.balance += curr.ext.$balance ? curr.ext.$balance : 0;
            if (curr.ext.$balanceObj && curr.ext.$balanceObj.data.isDirty) {
              prev.isDirty = true;
            }
            return prev;
          },
          { balance: 0, isDirty: false }
        ) as AccountBalance;
      })
    );
  }

  onClick(extAccount: Extended<AccountInfo>) {
    if (this.canSelect) {
      this.selectAccount(extAccount);
    } else {
      this.showAccountTransactions(extAccount);
    }
  }
  cancel() {
    this.modalController.dismiss();
  }
  async presentEditAccountModal(id) {

    const modal = await this.modalController.create({
      component: EditAccountPage,
      componentProps: {
        id
      }, cssClass: "edit-modal"
    });
    return modal.present();
}
async presentNewAccountModal() {
  return this.presentEditAccountModal("new");
}

  showAccountTransactions(accSnapshot: Extended<AccountInfo>) {
    this.dynamicList.closeSlidingItems();

    this.presentEditAccountModal(accSnapshot.id);
  }

  selectAccount(extAccount: Extended<AccountInfo>) {
    this.modalController.dismiss(extAccount);
    /*
    const callBack = this.navParams.get("callBack");
    callBack(extAccount).then(() => {
      //  this.navCtrl.pop();
    });
    // this.viewCtrl.dismiss(extAccount)
    */
  }

  invalidateBalance(accSnapshot: Extended<AccountInfo>) {
    if (accSnapshot.ext.$balanceObj.data.isDirty) {
      return this.accountsDataService.setAccountBalanceInvalid(accSnapshot.id);
    }
  }


  onDelete(accSnapshot: Extended<AccountInfo>) {
    this.dynamicList.closeSlidingItems();

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
  }

  ngOnInit() {
    if (this.navParams) {
      this.canSelect = this.navParams.get("canSelect");
    }
    this.ionViewDidLoad();
  }
}
