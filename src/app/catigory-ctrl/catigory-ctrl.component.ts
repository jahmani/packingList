import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-catigory-ctrl',
  templateUrl: './catigory-ctrl.component.html',
  styleUrls: ['./catigory-ctrl.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CatigoryCtrlComponent),
      multi: true
    }
  ]
})
export class CatigoryCtrlComponent implements OnInit {

  cats:  {[name: string]: string[]};
  catsMap: Map<string, string[]>;
  srcChangeFunction: any;

  constructor() { }
  writeValue( cats:  {[name: string]: string[]}): void {
    this.cats = cats;
    this.catsMap = new Map(Object.entries(cats));
  }
  registerOnChange(fn: any): void {
    this.srcChangeFunction = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  ngOnInit() {
  }

}
