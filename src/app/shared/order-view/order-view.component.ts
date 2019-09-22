import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Extended, Order, OrderRow2 } from '../../interfaces/data-models';
import { StoreInfoService } from '../../providers/AppData/store-info.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss']
})
export class OrderViewComponent implements OnChanges {

  _expanded = false;
  showLines = false;
  _showNotes = true;
  @Input() order: Extended<Order>;
  @Input() storeInfo;
  @Input() forProductId: string;
  @Input() fullView;
  @Input() set showNotes (val: boolean) {
    this._showNotes = val;
  }
  rows: Extended<OrderRow2>[];
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
  ngOnChanges(changes: SimpleChanges) {
    this.rows = this.order.ext.extRows;
    if (this.forProductId) {
      this.rows = this.rows.filter(row => row.data.productId === this.forProductId);
      this.fullView = true;
    }
  }
  openOrder(id: string, $event) {
    $event.stopPropagation();
    this.router.navigateByUrl(this.router.url + "/OrderView/" + id);
  }

}
