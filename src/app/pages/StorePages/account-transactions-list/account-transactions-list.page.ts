import { Component, OnInit, Optional } from "@angular/core";
import { Observable } from "rxjs";
import {
  ExtMap,
  Extended,
  Transaction,
  AccountInfo
} from "../../../interfaces/data-models";
import {
  NavController,
  NavParams,
  AlertController,
  ModalController
} from "@ionic/angular";
import { map, combineLatest, switchMap } from "rxjs/operators";
import { compareTimeStamp } from "../../../Util/compare-timetamp";
import { TransactionsDataService } from "../../../providers/StoreData/transactions-data.service";
import { AccountsDataService } from "../../../providers/StoreData/accounts-data.service";
import { TransactionCatsDataService } from "../../../providers/StoreData/transaction-cats-data.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-account-transactions-list",
  templateUrl: "./account-transactions-list.page.html",
  styleUrls: ["./account-transactions-list.page.scss"]
})
export class AccountTransactionsListPage implements OnInit {
  transSnapshots: Observable<ExtMap<Extended<Transaction>>>;
  transSnapshotsArray: Observable<Extended<Transaction>[]>;
  accountId: string;
  extAccount: Observable<Extended<AccountInfo>>;

  constructor(
    private route: ActivatedRoute,
    //  public navCtrl: NavController,
    //  public navParams: NavParams,
    private alertController: AlertController,
    private transactionsRep: TransactionsDataService,
    private accountsRep: AccountsDataService,
    private modalController: ModalController
  ) {
    // this.accountId = this.navParams.get("accountId");
    this.transSnapshots = this.route.paramMap.pipe(
      switchMap(params => {
        // (+) before `params.get()` turns the string into a number
        this.accountId = params.get("id");
        return this.transactionsRep.forAccount(this.accountId);
      })
    );
    this.transSnapshotsArray = this.transSnapshots.pipe(
      map(m =>
        m.toArray().sort((a, b) => {
          return Date.parse(a.data.date) - Date.parse(b.data.date);
        })
      )
    );

    this.transSnapshotsArray.subscribe(console.log);
    this.extAccount = this.accountsRep.getExtended(this.accountId);
    this.transSnapshotsArray = this.transSnapshotsArray.pipe(
      combineLatest(this.extAccount, (extTranses, extAccount) => {
        let currentBalance = extAccount.ext.$balanceObj.data
          ? extAccount.ext.$balanceObj.data.balance
          : 0;
        const transes = extTranses.sort((a, b) => {
          return compareTimeStamp(a.data.date, b.data.date);
        });
        transes.forEach(trans => {
          trans.ext.currentBalance = currentBalance;
          currentBalance -= trans.data.type * trans.data.ammount;
        });
        return transes;
      })
    );
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AccountTransactionsPage");
  }

  presentEditTransactionModal(transSnapshot: Extended<Transaction>) {
    //  this.navCtrl.push("EditTransactionPage", { transSnapshot });
  }
  showTransactionImage(transSnapshot: Extended<Transaction>) {
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
  }
  ionViewDidEnter() {
    /*
    this.accountsRep.getOnce(this.accountId).then(extAccount => {
      if (this.titleService) {
        this.titleService.setNav(this.navCtrl);
        this.titleService.setTitle("حساب " + extAccount.data.name);
      }
    });
    */
  }

  onDelete(transSnapshot: Extended<Transaction>) {
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
  }

  presentNewTransactionModal(type: number) {
    const date = new Date().toISOString();
    //    date = UTCToLocal(date)

    const newTransaction: Transaction = {
      type,
      accountId: this.accountId,
      date: date
    } as Transaction;
    return this.presentEditTransactionModal({ id: null, data: newTransaction });
  }

  ngOnInit() {}
}
