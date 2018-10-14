import { Component, OnInit, Optional } from "@angular/core";
import { Observable } from "rxjs";
import { Extended, Order } from "../../interfaces/data-models";
import { NavController, NavParams, AlertController, ModalController } from "@ionic/angular";
import { OrdersDataService } from "../../providers/StoreData/orders-data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { PhotoViewComponent } from "../../shared/photo-view/photo-view.component";

@Component({
  selector: "app-orders-list",
  templateUrl: "./orders-list.page.html",
  styleUrls: ["./orders-list.page.scss"]
})
export class OrdersListPage implements OnInit {
  orders: Observable<Extended<Order>[]>;

  constructor(
    public router: Router,
    private ordersRep: OrdersDataService,
    public route: ActivatedRoute,
    private alertController: AlertController,
    private modalController: ModalController,
  ) {
    this.orders = this.ordersRep.FormatedList;
    /*
    this.orders.pipe(tap((orders)=>{
      console.log("orderssssssssss")
      console.log(orders)
    }))
    */
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad OrdersListPage");
  }
  async delete(extOrder: Extended<Order>) {
    const modal = await this.alertController.create({
      message: `Are you sure deleting order: `,
      header: `Deleteing Order`,
      buttons: [
        {
          text: "Delete",
          handler: () => {
            this.ordersRep.remove(extOrder);
          }
        },
        { text: "cancel", cssClass: "danger" }
      ]
    });
    return await modal
      .present()
      .then(val => {
        console.log("val", val);
      })
      .catch(console.log);
  }
  presentEditOrderModal(orderId?: string) {
   // this.navCtrl.push("EditOrderPage", { orderId });
  }
  async showOrderImage(orderSnapshot: Extended<Order>) {
    if (orderSnapshot.ext.imageFile) {
      const modal = await this.modalController.create( {
        component: PhotoViewComponent,
        componentProps: {
        canDelete: false,
        canSelect: false,
        images: [orderSnapshot.data.imageUrl]
        }
      });
      modal.present();
    }
  }

  async onDelete(orderSnapshot: Extended<Order>) {
    const alert = await this.alertController.create({
      message: `Are u sure. deleting ${orderSnapshot.data.accountId} Order`,
      header: "Deleting Order",
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.ordersRep.remove(orderSnapshot);
          }
        },
        {
          text: "Cancel"
        }
      ]
    });
    return await alert.present();
  }

  presentNewOrderModal() {
    const date = new Date().toISOString();
    //    date = UTCToLocal(date)

    return this.presentEditOrderModal();
  }
  ngOnInit() {}
}
