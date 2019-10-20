import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IonSlides, IonItemSliding } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Extended, Product, Order } from '../../interfaces/data-models';
import { flatMap, tap } from 'rxjs/operators';
import { PageActions } from '../../shared/edit-options-popover/edit-options-popover.component';
import { EditProductPage } from '../edit-product/edit-product.page';
import { ActivePListService } from '../../providers/StoreData/active-plist.service';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-orders-slides',
  templateUrl: './orders-slides.page.html',
  styleUrls: ['./orders-slides.page.scss'],
})
export class OrdersSlidesPage implements AfterViewInit {
  actions = [PageActions.EDIT, PageActions.COPY];
  showSlideDetails;
  slideIndex = 0;
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  activeSlideIndex: Observable<number>;
  ordersList: Observable<Extended<Order>[]>;
  ordersListValue: Extended<Order>[];
  constructor(private apls: ActivePListService,
    private router: Router,
    activatedRoute: ActivatedRoute
  ) {
    this.ordersList = apls.activePlistOrders.pipe(
      tap(val => {
        this.ordersListValue = val;
      })
    );
    const paramIndex =  activatedRoute.snapshot.paramMap.get('index');
    this.slideIndex = Number.parseInt(paramIndex, 10) || 0;

  }


  ngAfterViewInit(): void {
    console.log('slides', this.slides);
    this.activeSlideIndex = this.slides.ionSlideDidChange.pipe(flatMap(ev => {
      // console.log('ev : ', ev);
      return this.slides.getActiveIndex();
      // console.log()
    })).pipe(
      // startWith(this.slideIndex),
      tap(i => {
        this.slideIndex = i;
      }));
  }
  onAction(action) {
    console.log(action);
    switch (action) {
      case PageActions.EDIT:
        this.onEdit();
        break;
      case PageActions.COPY:
          this.onEdit('copy');

        //  this.downloadImage();
        break;
      default:
        break;
    }
  }
  downloadImage() {
    // const prod = this.activeProduct;
    // return prod && window.open(prod.data.thumbUrl);
  }
  async onEdit(copy?: string) {
    const order = this.activeOrder;
    console.log(order);
    if (order) {
      return this.presentEditOrder(order.id, copy);
    }
  }
  private get activeOrder() {
    return this.ordersListValue && (this.slideIndex !== undefined) && this.ordersListValue[this.slideIndex];
  }


  async presentEditOrder(id, copy?) {
    this.router.navigate(['./StoreBase/EditOrderHeader/' + id, {copy}]);

    // const modal = await this.modalController.create({
    //   component: EditProductPage,
    //   componentProps: {
    //     id,
    //     copy
    //   }, cssClass: "edit-modal"
    // });
    // modal.present();
    // return modal.onDidDismiss();
  }
  async showNewProduct() {
    // return this.presentEditOrder("new").then(data => {
    //   if (data) {
    //     this.slideIndex = 0;
    //   }
    // });
  }

  trackByFn(index, order: Extended<Order>) {
    if (order) {
      return order.id;
    }
  }

}
