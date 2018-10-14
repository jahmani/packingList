import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreBasePage } from './store-base.page';

describe('StoreBasePage', () => {
  let component: StoreBasePage;
  let fixture: ComponentFixture<StoreBasePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreBasePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreBasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
