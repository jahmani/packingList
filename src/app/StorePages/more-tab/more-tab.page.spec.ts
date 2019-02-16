import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreTabPage } from './more-tab.page';

describe('MoreTabPage', () => {
  let component: MoreTabPage;
  let fixture: ComponentFixture<MoreTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreTabPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
