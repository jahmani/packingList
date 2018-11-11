import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPackinglistInfoPage } from './edit-packinglist-info.page';

describe('EditPackinglistInfoPage', () => {
  let component: EditPackinglistInfoPage;
  let fixture: ComponentFixture<EditPackinglistInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPackinglistInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPackinglistInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
