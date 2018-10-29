import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PhotoViewComponent } from "./photo-view/photo-view.component";
import { IonicModule } from "@ionic/angular";
import { OrderHeaderViewComponent } from "./order-header-view/order-header-view.component";
import { AccountPickerComponent } from "./account-picker/account-picker.component";
import { OrderHeaderEditComponent } from "./order-header-edit/order-header-edit.component";
import { PhotoPickerComponent } from "./photo-picker/photo-picker.component";
import { ReactiveFormsModule } from "@angular/forms";
import { PackingListComponent } from './packing-list/packing-list.component';
import { PackingRowComponent } from './packing-row/packing-row.component';
import { OrderRowComponent } from './order-row/order-row.component';
import { ProductPickerComponent } from './product-picker/product-picker.component';
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule],
  declarations: [
    PhotoViewComponent,
    OrderHeaderViewComponent,
    AccountPickerComponent,
    OrderHeaderEditComponent,
    PhotoPickerComponent,
    PackingListComponent,
    PackingRowComponent,
    OrderRowComponent,
    ProductPickerComponent
  ],
  entryComponents: [PhotoViewComponent],
  exports: [
    OrderHeaderViewComponent,
    OrderHeaderEditComponent,
    PhotoPickerComponent,
    AccountPickerComponent,
    PackingListComponent,
    ProductPickerComponent
  ]
})
export class SharedModule {}
