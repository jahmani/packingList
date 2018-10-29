import { Component, OnInit, Optional } from "@angular/core";
import { Observable, combineLatest } from "rxjs";
import {
  Extended,
  AccountInfo,
  AccountBalance
} from "../../interfaces/data-models";
import { FormControl } from "@angular/forms";
import {
  NavController,
  NavParams,
  ModalController,
  AlertController
} from "@ionic/angular";
import { debounceTime, startWith, map } from "rxjs/operators";
import { AccountsDataService } from "../../providers/StoreData/accounts-data.service";
import { UserStoresService } from "../../providers/AppData/user-stores.service";
import { ActiveStoreService } from "../../providers/AppData/active-store.service";
import { ProductsDataService } from "../../providers/StoreData/products-data.service";
import { Router } from "@angular/router";

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
  constructor(
    public accountsDataService: AccountsDataService,
    private modalController: ModalController,
    private navParams: NavParams,
    private router: Router
  //  private alertController: AlertController
  ) {
  //  this.accountsFsRepository = this.accountsFsRepository;
    this.accounts = this.accountsDataService.FormatedList;
    this.searchControl = new FormControl();
    this.accounts.subscribe(console.log);
  }
  ionViewDidLoad() {
    // searchControl.valueChanges will not emit values untill the user make input
    // combineLatest will not emit values untill both ovseravables emit values
    //
    const initializedValueChanges = this.searchControl.valueChanges
      .pipe(debounceTime(700))
      .pipe(startWith(null));
    /*
    merged.subscribe(searcTerm => {
      console.log("merge Eimit", searcTerm)
    })
    */
    this.filteredAccounts = combineLatest(
      initializedValueChanges,
      this.accounts,
      (searcTerm: string, extAccounts) => {
        if (!searcTerm || !searcTerm.length) {
          return extAccounts;
        }
        return extAccounts.filter(extAccount => {
          return (
            extAccount.data.name.includes(searcTerm) ||
            extAccount.data.city.includes(searcTerm)
          );
        });
      }
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
    /**/
    const canSelect = this.navParams.get("canSelect");
    if (canSelect) {
      this.selectAccount(extAccount);
    } else {
      this.showAccountTransactions(extAccount);
    }
  }
  showAccountTransactions(accSnapshot: Extended<AccountInfo>) {
      this.router.navigateByUrl(`/StoreBase/EditAccount/${accSnapshot.id}`);
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

  presentEditAccountModal(accSnapshot: Extended<AccountInfo>) {
    //  this.navCtrl.push("EditAccountPage", { accSnapshot });
  }
  presentNewAccountModal() {
    return this.presentEditAccountModal({ id: null, data: {} as AccountInfo });
  }

  onDelete(accSnapshot: Extended<AccountInfo>) {
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

  ionViewDidEnter() {}
  ngOnInit() {}
}
