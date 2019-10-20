import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-packing-line-editor',
  templateUrl: './packing-line-editor.component.html',
  styleUrls: ['./packing-line-editor.component.scss']
})
export class PackingLineEditorComponent implements OnInit {
  @Input() packingLineForm: FormGroup;
  @Input() index: number;
  @Output() quantityChanged = new EventEmitter<number>();

  constructor() { }

  get ctns() {
    const str = this.packingLineForm.get('ctns').value;
    return Number.parseFloat(str);
  }
  get ctnsCtrl() {
    return this.packingLineForm.get('ctns');
  }
  get packingCtrl() {
    return this.packingLineForm.get('packing');
  }
  get quantityCtrl() {
    return this.packingLineForm.get('quantity');
  }
  get packing()  {
    const str = this.packingLineForm.get('packing').value ;
    return Number.parseFloat(str);
  }

  ngOnInit() {
  }


}
