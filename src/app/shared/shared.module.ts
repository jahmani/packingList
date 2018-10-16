import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PhotoViewComponent } from "./photo-view/photo-view.component";
import { IonicModule } from "@ionic/angular";
import { OrderHeaderViewComponent } from "./order-header-view/order-header-view.component";
import { AccountPickerComponent } from "./account-picker/account-picker.component";
import { OrderHeaderEditComponent } from "./order-header-edit/order-header-edit.component";
import { PhotoPickerComponent } from "./photo-picker/photo-picker.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  declarations: [
    PhotoViewComponent,
    OrderHeaderViewComponent,
    AccountPickerComponent,
    OrderHeaderEditComponent,
    PhotoPickerComponent
  ],
  entryComponents: [PhotoViewComponent],
  exports: [
    OrderHeaderViewComponent,
    OrderHeaderEditComponent,
    PhotoPickerComponent,
    AccountPickerComponent
  ]
})
export class SharedModule {}
