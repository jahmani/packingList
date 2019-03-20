import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreUsersPage } from './store-users.page';

describe('StoreUsersPage', () => {
  let component: StoreUsersPage;
  let fixture: ComponentFixture<StoreUsersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreUsersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
