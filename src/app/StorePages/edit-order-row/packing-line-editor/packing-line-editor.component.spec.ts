import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingLineEditorComponent } from './packing-line-editor.component';

describe('PackingLineEditorComponent', () => {
  let component: PackingLineEditorComponent;
  let fixture: ComponentFixture<PackingLineEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingLineEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingLineEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
