import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-edit-options-popover',
  templateUrl: './edit-options-popover.component.html',
  styleUrls: ['./edit-options-popover.component.scss']
})
export class EditOptionsPopoverComponent implements OnInit {

  constructor(private popOverCtrl: PopoverController) { }

  ngOnInit() {
  }
  optionClicked( action: string) {
    this.popOverCtrl.dismiss(null , action);
  }

}
