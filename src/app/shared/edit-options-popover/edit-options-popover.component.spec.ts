import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOptionsPopoverComponent } from './edit-options-popover.component';

describe('EditOptionsPopoverComponent', () => {
  let component: EditOptionsPopoverComponent;
  let fixture: ComponentFixture<EditOptionsPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOptionsPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOptionsPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
