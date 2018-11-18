import { Component, OnInit, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { OrderRow2, Extended } from "../../interfaces/data-models";
import { ModalController } from "@ionic/angular";
import { EditOrderRowPage } from "../../StorePages/edit-order-row/edit-order-row.page";

@Component({
  selector: "app-order-row-editor",
  templateUrl: "./order-row-editor.component.html",
  styleUrls: ["./order-row-editor.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OrderRowEditorComponent),
      multi: true
    }
  ]
})
export class OrderRowEditorComponent implements OnInit, ControlValueAccessor {
  orderRow: Extended<OrderRow2>;
  srcChangeFunction: any;

  writeValue(obj: Extended<OrderRow2>): void {
    this.orderRow = obj;
  }
  registerOnChange(fn: any): void {
    this.srcChangeFunction = fn;
  }
  registerOnTouched(fn: any): void {}

  constructor(private modalCtrl: ModalController) {}
  removeRow() {

  }
  async showEditOrderRowModal() {
    const modal = await this.modalCtrl.create({
      component: EditOrderRowPage,
      componentProps: {
        orderRow: this.orderRow
      }
    });
    modal.onDidDismiss().then(res => {
      if (!res || !res.role || !res.data) {
        return;
      }
      switch (res.role) {
        case "delete":
          this.srcChangeFunction(null);
          break;
        case "save":
          this.srcChangeFunction(res.data);
          this.orderRow = res.data;
          break;
        default:
          break;
      }
    });
    return modal.present();
  }
  ngOnInit() {}
}
