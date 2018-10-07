import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStoresPage } from './user-stores.page';

describe('UserStoresPage', () => {
  let component: UserStoresPage;
  let fixture: ComponentFixture<UserStoresPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserStoresPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
