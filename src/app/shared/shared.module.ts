import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PhotoViewComponent } from "./photo-view/photo-view.component";
import { IonicModule } from "@ionic/angular";
import { OrderHeaderViewComponent } from "./order-header-view/order-header-view.component";
import { AccountPickerComponent } from "./account-picker/account-picker.component";
import { PhotoPickerComponent } from "./photo-picker/photo-picker.component";
import { ReactiveFormsModule } from "@angular/forms";
import { OrderRowsListComponent } from './order-rows-list/order-rows-list.component';
import { OrderRowComponent } from './order-row/order-row.component';
import { ProductPickerComponent } from './product-picker/product-picker.component';
import { RouterModule } from "@angular/router";
import { PackingListComponent } from './packing-list/packing-list.component';

@NgModule({
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule],
  declarations: [
    PhotoViewComponent,
    OrderHeaderViewComponent,
    AccountPickerComponent,
    PhotoPickerComponent,
    OrderRowsListComponent,
    OrderRowComponent,
    ProductPickerComponent,
    PackingListComponent,
  ],
  entryComponents: [PhotoViewComponent],
  exports: [
    OrderHeaderViewComponent,
    PhotoPickerComponent,
    AccountPickerComponent,
    OrderRowsListComponent,
    ProductPickerComponent,
    PackingListComponent
  ]
})
export class SharedModule {}
