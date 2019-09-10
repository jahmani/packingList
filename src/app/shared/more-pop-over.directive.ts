import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { EditOptionsPopoverComponent, PageActions, ViewType } from './edit-options-popover/edit-options-popover.component';

@Directive({
  selector: '[appMorePopOver]'
})
export class MorePopOverDirective {
  constructor(
    private popoverController: PopoverController
  ) { }
  @Input() actions: PageActions[];
  @Input() views: ViewType[];
  @Input() view: ViewType;
  @Output() action = new EventEmitter<PageActions>();
  @Output() viewChange = new EventEmitter<ViewType>();
  @HostListener('click', ['$event']) onMouseLeave(event) {
    this.showPopOver(event);
  }
  async showPopOver(ev) {
    const popOver = await this.popoverController.create({
      component: EditOptionsPopoverComponent,
      componentProps: {
        actions: this.actions,
        views: this.views,
        view: this.view
      },
      event: ev,
    });
    await popOver.present();
    popOver.onDidDismiss().then((val) => {
      const action = val.role as unknown as PageActions;
      const view = val.data as ViewType;
      if (action) {
        this.action.emit(action);
      } else if (view) {
        this.viewChange.emit(view);

      }
    });

  }

}
