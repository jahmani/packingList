import { Injectable } from "@angular/core";
import { StoreDataService } from "./store-data.service";
import { AccountInfo, ExtType, Extended } from "../../interfaces/data-models";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActiveStoreService } from "../AppData/active-store.service";
import { StorePathConfig } from "../../interfaces/StorePathConfig";
import { Observable, combineLatest } from "rxjs";
import { compareTimeStamp } from "../../Util/compare-timetamp";
import { map } from "rxjs/operators";
import { AccountsBalanceService } from "./accounts-balance.service";

@Injectable({
  providedIn: "root"
})
export class AccountsDataService extends StoreDataService<AccountInfo> {
  constructor(
    afs: AngularFirestore,
    activeStoreService: ActiveStoreService,
    private accountsBalanceFBRepository: AccountsBalanceService
  ) {
    super(afs, activeStoreService, StorePathConfig.AccountsInfo);
    console.log("Hello AccountsFBRepository Provider");
  }
  get FormatedList(): Observable<any[]> {
    return combineLatest(this.accountsBalanceFBRepository.dataMap, this.List())
      .pipe(
        map(([balancesMap, accounts]) => {
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
        })
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
    const extended = combineLatest(
      account,
      balance,
      (extAccount, extBalance) => {
        extAccount.ext = extAccount.ext || {};
        extAccount.ext.$balanceObj = extBalance;
        return extAccount;
      }
    );
    return extended;
  }
}
