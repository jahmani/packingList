import { Component, OnInit, Input } from '@angular/core';
import { Extended, Order } from '../../interfaces/data-models';
import { StoreInfoService } from '../../providers/AppData/store-info.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss']
})
export class OrderViewComponent implements OnInit {

  _expanded = false;
  showLines = false;
  @Input() order: Extended<Order>;
  @Input() storeInfo;
  // @Input() ;
  @Input() fullView;
  @Input() showHeader;
  @Input() set expanded(val: boolean) {
    this._expanded = val;
    if (val) {
      this.showLines = true;
    } else {
      setTimeout(() => {
        this.showLines = false;
      }, 450);
    }

  }
  constructor(private router: Router) { }

  ngOnInit() {
  }
  openOrder(id: string, $event) {
    $event.stopPropagation();
    this.router.navigateByUrl(this.router.url + "/OrderView/" + id);
  }

}
