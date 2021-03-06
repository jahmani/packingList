import { NgModule } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
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
import { OrderRowEditorComponent } from './order-row-editor/order-row-editor.component';
import { ProductViewComponent } from "./product-view/product-view.component";
import { ImageEditorPage } from "../pages/image-editor/image-editor.page";
import { ImageCropperComponent } from "../pages/image-editor/image-cropper/image-cropper.component";
import { PhotoUploadComponent } from './photo-upload/photo-upload.component';
import { EditPhotoPage } from "../pages/edit-photo/edit-photo.page";
import { StoreCurrencyPipe } from './store-currency.pipe';
import { OrderHeaderBriefRowViewComponent } from './order-header-brief-row-view/order-header-brief-row-view.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrderViewComponent } from './order-view/order-view.component';
import { EditOptionsPopoverComponent } from './edit-options-popover/edit-options-popover.component';
import { ExpandableComponent } from "./expandable/expandable.component";
import { OrdersOfProductViewComponent } from './orders-of-product-view/orders-of-product-view.component';
import { MorePopOverDirective } from './more-pop-over.directive';
import { ProductsListViewComponent } from './products-list-view/products-list-view.component';
import { ThumExpandDirective } from './thum-expand.directive';
import { ThumbExpandDirective } from './thumb-expand.directive';

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
    OrderRowEditorComponent,
  ProductViewComponent, ImageEditorPage, ImageCropperComponent, PhotoUploadComponent,
   EditPhotoPage, StoreCurrencyPipe, OrderHeaderBriefRowViewComponent, OrdersListComponent, OrderViewComponent, EditOptionsPopoverComponent,
   ExpandableComponent,
   OrdersOfProductViewComponent,
   MorePopOverDirective,
   ProductsListViewComponent,
   ThumExpandDirective,
   ThumbExpandDirective
  ],
  entryComponents: [PhotoViewComponent, ImageEditorPage, PhotoUploadComponent,
    EditPhotoPage, EditOptionsPopoverComponent, MorePopOverDirective],
  providers: [StoreCurrencyPipe, CurrencyPipe],
  exports: [
    MorePopOverDirective,
    OrderHeaderViewComponent,
    PhotoPickerComponent,
    AccountPickerComponent,
    OrderRowsListComponent,
    OrdersListComponent,
    ProductPickerComponent,
    PackingListComponent,
    OrderRowEditorComponent,
    ProductViewComponent,
    StoreCurrencyPipe,
    OrderViewComponent,
    EditOptionsPopoverComponent,
    ExpandableComponent
  ]
})
export class SharedModule {}
