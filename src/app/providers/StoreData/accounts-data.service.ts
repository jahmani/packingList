import { Injectable } from "@angular/core";
import { StoreDataService } from "./store-data.service";
import { AccountInfo, ExtType, Extended } from "../../interfaces/data-models";
import { DatePipe } from "@angular/common";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActiveStoreService } from "../AppData/active-store.service";
import { StorePathConfig } from "../../interfaces/StorePathConfig";
import { Observable } from "rxjs";
import { compareTimeStamp } from "../../Util/compare-timetamp";
import { map, combineLatest } from "rxjs/operators";
import { AccountsBalanceService } from "./accounts-balance.service";

@Injectable({
  providedIn: "root"
})
export class AccountsDataService extends StoreDataService<AccountInfo> {
  constructor(
    private datePipe: DatePipe,
    afs: AngularFirestore,
    activeStoreService: ActiveStoreService,
    private accountsBalanceFBRepository: AccountsBalanceService
  ) {
    super(afs, activeStoreService, StorePathConfig.AccountsInfo);
    console.log("Hello AccountsFBRepository Provider");
  }
  get FormatedList(): Observable<any[]> {
    return this.List()
      .pipe(
        /*  */

        combineLatest(
          this.accountsBalanceFBRepository.dataMap,
          (accounts, balancesMap) => {
            accounts.forEach(account => {
              account.ext = account.ext || ({} as ExtType);
              account.ext.$balance = 0;
              account.ext.$computedLastEditedOn = account.data.lastEditedOn;
              const balanceObj = balancesMap.get(account.id);
              if (balanceObj) {
                account.ext.$balanceObj = balanceObj;
                account.ext.$balance = balanceObj.data.balance;
                if (
                  compareTimeStamp(
                    account.ext.$computedLastEditedOn,
                    balanceObj.data.lastEditedOn
                  ) > 0
                ) {
                  account.ext.$computedLastEditedOn =
                    balanceObj.data.lastEditedOn;
                }
                //   if (balanceObj.lastEditedDate > account.$computedLastEditDate)
                //     account.$computedLastEditDate = balanceObj.lastEditedDate;
              }
            });
            return accounts;
          }
        )
      )
      .pipe(
        map(accountsArray => {
          return accountsArray.sort((a, b) => {
            return compareTimeStamp(
              a.ext.$computedLastEditedOn,
              b.ext.$computedLastEditedOn
            );
          });
        })
      );
  }

  setAccountBalanceInvalid(accountId: string) {
    return this.accountsBalanceFBRepository.setAccountBalanceInvalid(accountId);
  }
  getExtended(accountId: string): Observable<Extended<AccountInfo>> {
    const account = super.get(accountId);
    const balance = this.accountsBalanceFBRepository.get(accountId);
    const extended = account.pipe(
      combineLatest(balance, (extAccount, extBalance) => {
        extAccount.ext = extAccount.ext || {};
        extAccount.ext.$balanceObj = extBalance;
        return extAccount;
      })
    );
    return extended;
  }
}
