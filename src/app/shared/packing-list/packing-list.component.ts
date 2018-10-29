import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Extended, PLLine } from '../../interfaces/data-models';

@Component({
  selector: 'app-packing-list',
  templateUrl: './packing-list.component.1.html',
  styleUrls: ['./packing-list.component.1.scss']
})
export class PackingListComponent implements OnInit {

  lines: Extended<PLLine>[];
  totals: { ctns: number; qty: number; ammount: number; productName: string; };
  activeLineIndex: number;
  @Input("lines") set _lines (val: Extended<PLLine>[]) {
    this.lines = val;
    this.computeTotal();
  }
  @Output() plLineWantEdit: EventEmitter<string> = new EventEmitter();
  @Output() plLineWantCopy: EventEmitter<Extended<PLLine>> = new EventEmitter();

  plHeaders = [
    {title: "ctns", width: "16%"},
    {title: "packing", width: "16%"},
    {title: "qty", width: "26%"},
    {title: "price", width: "16%"},
    {title: "ammount", width: "26%"}
  ];
  plSummery = [
    {title: "ctns", width: "16%"},
    {title: " ", width: "16%"},
    {title: "qty", width: "26%"},
    {title: "Total:", width: "16%"},
    {title: "ammount", width: "26%"}
  ];
  constructor() {
    console.log('Hello PackingListComponent Component');
  }

  onPlLineClicked(index: number) {
    return this.toggleActiveLine(index);
  }
  toggleActiveLine(index: number) {
    if (this.activeLineIndex === index) {
      this.activeLineIndex = undefined;
    } else {
      this.activeLineIndex =  index;
    }

  }
  onPlLineEditClicked(plLine: Extended<PLLine>) {
    this.plLineWantEdit.emit(plLine.id);
  }
  onPlLineCopyClicked(plLine: Extended<PLLine>) {
    this.plLineWantCopy.emit(plLine);
  }
  computeTotal() {
    const ctns = 0;
    const qty = 0;
    const ammount = 0;
    const totalsLine = this.lines.reduce((prev, curr, i, arr) => {
      prev.ctns += Number(curr.data.ctns) || 0;
      prev.qty += Number(curr.data.qty) || 0;
      prev.ammount += Number(curr.data.ammount) || 0;
      return prev;
    }, {ctns: 0, qty: 0, ammount: 0, productName: "Totals"});
    this.totals = totalsLine;
    this.plSummery[0].title = totalsLine.ctns.toString();
    this.plSummery[2].title = totalsLine.qty.toString();
    this.plSummery[4].title = totalsLine.ammount.toString();

  }
  ngOnInit() {
  }

}
