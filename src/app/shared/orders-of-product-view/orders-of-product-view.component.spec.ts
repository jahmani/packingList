import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersOfProductViewComponent } from './orders-of-product-view.component';

describe('OrdersOfProductViewComponent', () => {
  let component: OrdersOfProductViewComponent;
  let fixture: ComponentFixture<OrdersOfProductViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersOfProductViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersOfProductViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
