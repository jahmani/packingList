import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { StoreBasePage } from "./store-base/store-base.page";
import { StoreBaseRoutingModule } from "./store-base-routing.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreBaseRoutingModule
    ],
  declarations: [StoreBasePage]
})
export class StoreBasePageModule {}
