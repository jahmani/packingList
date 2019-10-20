import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersSlidesPage } from './orders-slides.page';

describe('OrdersSlidesPage', () => {
  let component: OrdersSlidesPage;
  let fixture: ComponentFixture<OrdersSlidesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersSlidesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersSlidesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
