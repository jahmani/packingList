import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
export enum PageActions {
  SAVE, SAVECOPY, DELETE, EDIT, DOWNLOADIMAGE, FILTER, ADDNEW
}
export enum ViewType {
  GRID, LIST, CARDS
}

@Component({
  selector: 'app-edit-options-popover',
  templateUrl: './edit-options-popover.component.html',
  styleUrls: ['./edit-options-popover.component.scss']
})
export class EditOptionsPopoverComponent {
  _actions: PageActions[] = [];
  _views: ViewType[] = [];

  constructor(private popOverCtrl: PopoverController) { }
  PageActions = PageActions;
  View = ViewType;
  @Input() set actions(val: PageActions[]) {
    this._actions = val || [];
  }
  @Input() set views(val: ViewType[]) {
    this._views = val || [];
  }
  @Input() view: ViewType;

  optionClicked(action: string) {
    this.popOverCtrl.dismiss(null, action);
  }
  viewChanged(ev) {
    this.popOverCtrl.dismiss(ev.detail.value);

  }

}
