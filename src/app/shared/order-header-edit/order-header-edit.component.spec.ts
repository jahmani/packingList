import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHeaderEditComponent } from './order-header-edit.component';

describe('OrderHeaderEditComponent', () => {
  let component: OrderHeaderEditComponent;
  let fixture: ComponentFixture<OrderHeaderEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderHeaderEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHeaderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
