import { Component, OnInit } from '@angular/core';
import { AccountsDataService } from '../../providers/StoreData/accounts-data.service';

@Component({
  selector: 'app-store-base',
  templateUrl: './store-base.page.html',
  providers: [AccountsDataService],
  styleUrls: ['./store-base.page.scss'],

})
export class StoreBasePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
