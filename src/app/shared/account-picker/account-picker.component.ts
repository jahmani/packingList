import { Component, OnInit, forwardRef } from "@angular/core";
import { Extended, AccountInfo } from "../../interfaces/data-models";
import { ModalController, NavController } from "@ionic/angular";
import { AccountsDataService } from "../../providers/StoreData/accounts-data.service";
import { AccountsListPage } from "../../StorePages/accounts-list/accounts-list.page";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-account-picker",
  templateUrl: "./account-picker.component.html",
  styleUrls: ["./account-picker.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AccountPickerComponent),
      multi: true
    }
  ]
})
export class AccountPickerComponent implements OnInit {
  srcChangeFunction: any;
  accountId: string;
  account: Extended<AccountInfo>;

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private accountsFsRepository: AccountsDataService
  ) {
    console.log("Hello AccountInfoSelectComponent Component");
  }
  writeValue(accountId: string): void {
    this.accountId = accountId;
    if (this.accountId) {
      this.accountsFsRepository.getOnce(this.accountId).then(extAccountInfo => {
        this.account = extAccountInfo;
      });
    }
  }
  removeAccountInfo($event) {
    this.account = null;
    this.accountId = null;
    this.srcChangeFunction(this.accountId);
  }
  async selectAccountInfo($event) {
    const modal = await this.modalCtrl.create({
      component: AccountsListPage,
      componentProps: {
        accountsFsRepository: this.accountsFsRepository,
        nav: this.navCtrl,
        canSelect: true,
        canGoBack: true
      }
    });
    modal.onDidDismiss().then((result: {[s: string]: Extended<AccountInfo>}) => {
      if (result && result.data) {
        const extAccountInfo = result.data;
        this.account = extAccountInfo;
        this.accountId = extAccountInfo.id;
        this.srcChangeFunction(extAccountInfo.id);
      }
    });
    return modal.present();
  }
  registerOnChange(fn: any): void {
    this.srcChangeFunction = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  ngOnInit() {}
}
