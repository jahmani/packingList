import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStoreUserPage } from './edit-store-user.page';

describe('EditStoreUserPage', () => {
  let component: EditStoreUserPage;
  let fixture: ComponentFixture<EditStoreUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditStoreUserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStoreUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
