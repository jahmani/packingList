import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPhotoPage } from './edit-photo.page';


describe('EditPhotoPage', () => {
  let component: EditPhotoPage;
  let fixture: ComponentFixture<EditPhotoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPhotoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPhotoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
