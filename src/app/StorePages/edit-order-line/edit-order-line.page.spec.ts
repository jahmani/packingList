import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrderLinePage } from './edit-order-line.page';

describe('EditOrderLinePage', () => {
  let component: EditOrderLinePage;
  let fixture: ComponentFixture<EditOrderLinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOrderLinePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrderLinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
