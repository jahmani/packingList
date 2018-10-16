import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrderHeaderPage } from './edit-order-header.page';

describe('EditOrderHeaderPage', () => {
  let component: EditOrderHeaderPage;
  let fixture: ComponentFixture<EditOrderHeaderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOrderHeaderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrderHeaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
