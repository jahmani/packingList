import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageEditorPage } from './image-editor.page';

describe('ImageEditorPage', () => {
  let component: ImageEditorPage;
  let fixture: ComponentFixture<ImageEditorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageEditorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
