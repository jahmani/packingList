import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHeaderViewComponent } from './order-header-view.component';

describe('OrderHeaderViewComponent', () => {
  let component: OrderHeaderViewComponent;
  let fixture: ComponentFixture<OrderHeaderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderHeaderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHeaderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
