import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Extended, OrderRow, OrderRow2 } from "../../interfaces/data-models";

@Component({
  selector: "app-order-rows-list",
  templateUrl: "./order-rows-list.component.html",
  styleUrls: ["./order-rows-list.component.scss"]
})
export class OrderRowsListComponent implements OnInit {
  orderRows: Extended<OrderRow2>[];
  totals: { qty: number; ammount: number; productName: string };
  activeLineIndex: number;
  @Input() showTotals = true;
  @Input("rows")
  set _rows(val: Extended<OrderRow2>[]) {
    this.orderRows = val;
    if (val) { this.computeTotal(); }
    console.log("linnnnes: ", val);
  }


  constructor() {
    console.log("Hello OrderRowsListComponent Component");
  }

  onRowClicked(index: number) {
    return this.toggleActiveRow(index);
  }
  toggleActiveRow(index: number) {
    if (this.activeLineIndex === index) {
      this.activeLineIndex = undefined;
    } else {
      this.activeLineIndex = index;
    }
  }

  computeTotal() {

    const totalsLine = this.orderRows.reduce(
      (prev, curr, i, arr) => {
        prev.qty += Number(curr.data.qty) || 0;
        prev.ammount += Number(curr.data.ammount) || 0;
        return prev;
      },
      { qty: 0, ammount: 0, productName: "Totals" }
    );
    this.totals = totalsLine;
  }
  ngOnInit() {}
}
