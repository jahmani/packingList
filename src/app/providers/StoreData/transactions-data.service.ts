import { Injectable } from '@angular/core';
import { StoreDataService } from './store-data.service';
import { Transaction, ExtMap, Extended, ExtType } from '../../interfaces/data-models';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActiveStoreService } from '../AppData/active-store.service';
import { StorePathConfig } from '../../interfaces/StorePathConfig';
import { Observable, combineLatest } from 'rxjs';
import { AccountsDataService } from './accounts-data.service';
import { ImagesDataService } from './images-data.service';
import { TransactionCatsDataService } from './transaction-cats-data.service';
import { AccountsBalanceService } from './accounts-balance.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionsDataService extends StoreDataService<Transaction> {
  private formatedList;

  constructor(
    afs: AngularFirestore,
    activeStoreService: ActiveStoreService,
    private imagesFsRepository: ImagesDataService,
    private tCatFsRep: TransactionCatsDataService,
    private balanceFsRep: AccountsBalanceService
    )  {
    super(afs, activeStoreService, StorePathConfig.Transactions);
    console.log('Hello TransactionsFsRepository Provider');
  }
  forAccount(accountKey: string) {

    const transactionsColl$ = this.path$.pipe(map((path) => {
      return this.afs.collection<Transaction>(path, (ref) => ref.where('accountId', '==', accountKey));
    }));
   // const transactionsList = super.snapList(transactionsColl);
    const transactionsMap = transactionsColl$.pipe(switchMap((transactionsColl) => {
        return super.snapshotMap(transactionsColl.snapshotChanges());
    }));
    // return transactionsMap
    return this.extendedDataMap(transactionsMap);
  }

  extendedDataMap(transactionsMap: Observable<ExtMap<Extended<Transaction>>>): Observable<ExtMap<Extended<Transaction>>> {
    const extendedTranses = combineLatest(transactionsMap, this.tCatFsRep.DataMap, this.imagesFsRepository.DataMap,
      (transs, cats, images) => {
      transs.forEach((trans) => {

        trans.ext = trans.ext || {} as ExtType;

        trans.ext.catigory = cats.get(trans.data.catigoryId);
        if (trans.data.imageSrc && !trans.data.imageSrc.includes("//")) {
        trans.ext.imageFile = images.get(trans.data.imageSrc);
        }
      });
      return transs;
    });
    return extendedTranses;
  }

  beforeTransactionUpdated(oldTransaction: Extended<Transaction>, newTransaction: Extended<Transaction>, newId?: string) {
    const accountId = oldTransaction ? oldTransaction.data.accountId : newTransaction.data.accountId;
    const transactionId = oldTransaction ? oldTransaction.id : newId;
    const deltaAmmount = this.computeDeltaAmmount(oldTransaction, newTransaction);

    if (deltaAmmount !== 0) {
      return this.balanceFsRep.setAccountBalanceDirty(accountId, transactionId);
    } else {
    return Promise.resolve();
    }
  }
  async saveNew(newItem, id?: string) {
    id = id || await this.newKey();
    return this.beforeTransactionUpdated(null, newItem, id).then(() => {
      return super.saveNew(newItem, id).then(() => {
        return this.afterTransactionUpdated(null, newItem);
      });
    });
  }

  saveOld(editedItem: Extended<Transaction>) {
    return this.getOnce(editedItem.id).then((oldItem) => {
      return this.beforeTransactionUpdated(oldItem, editedItem).then(() => {
        return super.saveOld(editedItem).then(() => {
          return this.afterTransactionUpdated(oldItem, editedItem);
        });
      });
    });
  }

  remove(removedItem: Extended<Transaction>) {
      return this.beforeTransactionUpdated(removedItem, null).then(() => {
        return super.remove(removedItem).then(() => {
          return this.afterTransactionUpdated(removedItem, null);
        });
      });
  }

  afterTransactionUpdated(oldTransaction: Extended<Transaction>, newTransaction: Extended<Transaction>) {
    const accountId = oldTransaction ? oldTransaction.data.accountId : newTransaction.data.accountId;

    const deltaAmmount = this.computeDeltaAmmount(oldTransaction, newTransaction);

    if (deltaAmmount !== 0) {
      return this.balanceFsRep.updateAccountBalanceAmmount(accountId, deltaAmmount);
    } else {
      return Promise.resolve();
    }
  }


  private computeDeltaAmmount(oldTransaction: Extended<Transaction>, newTransaction: Extended<Transaction>) {
    const oldAmmount = oldTransaction ? oldTransaction.data.ammount * oldTransaction.data.type : 0;
    const newAmmount = newTransaction ? newTransaction.data.ammount * newTransaction.data.type : 0;
    const deltaAmmount = newAmmount - oldAmmount;
    return deltaAmmount;
  }

}
