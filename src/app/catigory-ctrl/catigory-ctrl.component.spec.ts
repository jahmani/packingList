import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatigoryCtrlComponent } from './catigory-ctrl.component';

describe('CatigoryCtrlComponent', () => {
  let component: CatigoryCtrlComponent;
  let fixture: ComponentFixture<CatigoryCtrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatigoryCtrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatigoryCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
