import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackinglistsPage } from './packinglists.page';

describe('PackinglistsPage', () => {
  let component: PackinglistsPage;
  let fixture: ComponentFixture<PackinglistsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackinglistsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackinglistsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
