import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Extended, OrderRow } from "../../interfaces/data-models";

@Component({
  selector: "app-order-rows-list",
  templateUrl: "./order-rows-list.component.html",
  styleUrls: ["./order-rows-list.component.scss"]
})
export class OrderRowsListComponent implements OnInit {
  orderRows: Extended<OrderRow>[];
  totals: { qty: number; ammount: number; productName: string };
  activeLineIndex: number;
  @Input("rows")
  set _rows(val: Extended<OrderRow>[]) {
    this.orderRows = val;
    if (val) { this.computeTotal(); }
    console.log("linnnnes: ", val);
  }

  plHeaders = [
    { title: "ctns", width: "16%" },
    { title: "packing", width: "16%" },
    { title: "qty", width: "26%" },
    { title: "price", width: "16%" },
    { title: "ammount", width: "26%" }
  ];
  plSummery = [
    { title: "ctns", width: "16%" },
    { title: " ", width: "16%" },
    { title: "qty", width: "26%" },
    { title: "Total:", width: "16%" },
    { title: "ammount", width: "26%" }
  ];
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
    const qty = 0;
    const ammount = 0;
    const totalsLine = this.orderRows.reduce(
      (prev, curr, i, arr) => {
        prev.qty += Number(curr.data.qty) || 0;
        prev.ammount += Number(curr.data.ammount) || 0;
        return prev;
      },
      { qty: 0, ammount: 0, productName: "Totals" }
    );
    this.totals = totalsLine;
    this.plSummery[2].title = totalsLine.qty.toString();
    this.plSummery[4].title = totalsLine.ammount.toString();
  }
  ngOnInit() {}
}
