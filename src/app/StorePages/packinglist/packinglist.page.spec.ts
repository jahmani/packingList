import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackinglistPage } from './packinglist.page';

describe('PackinglistPage', () => {
  let component: PackinglistPage;
  let fixture: ComponentFixture<PackinglistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackinglistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackinglistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
