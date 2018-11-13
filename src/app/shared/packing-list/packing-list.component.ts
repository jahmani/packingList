import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Extended, OrderRow } from '../../interfaces/data-models';

@Component({
  selector: 'app-packing-list',
  templateUrl: './packing-list.component.html',
  styleUrls: ['./packing-list.component.scss']
})
export class PackingListComponent implements OnInit , OnChanges {
  @Input() orderRows: Extended<OrderRow>[];
  ngOnChanges(changes: SimpleChanges): void {
    console.log("Changes: ", changes);
  }
  constructor() { }

  ngOnInit() {
  }

}
