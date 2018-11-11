import { Component, OnInit, Input } from '@angular/core';
import { Extended, OrderRow } from '../../interfaces/data-models';

@Component({
  selector: 'app-packing-list',
  templateUrl: './packing-list.component.html',
  styleUrls: ['./packing-list.component.scss']
})
export class PackingListComponent implements OnInit {
  @Input() orderRows: Extended<OrderRow>[];
  constructor() { }

  ngOnInit() {
  }

}
