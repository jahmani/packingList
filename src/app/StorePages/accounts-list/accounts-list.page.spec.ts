import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsListPage } from './accounts-list.page';

describe('AccountsListPage', () => {
  let component: AccountsListPage;
  let fixture: ComponentFixture<AccountsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
