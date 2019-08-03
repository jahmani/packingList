import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHeaderBriefRowViewComponent } from './order-header-brief-row-view.component';

describe('OrderHeaderBriefRowViewComponent', () => {
  let component: OrderHeaderBriefRowViewComponent;
  let fixture: ComponentFixture<OrderHeaderBriefRowViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderHeaderBriefRowViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHeaderBriefRowViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
