import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrderRowPage } from './edit-order-row.page';

describe('EditOrderRowPage', () => {
  let component: EditOrderRowPage;
  let fixture: ComponentFixture<EditOrderRowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOrderRowPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrderRowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
