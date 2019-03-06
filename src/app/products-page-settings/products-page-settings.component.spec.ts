import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsPageSettingsComponent } from './products-page-settings.component';

describe('ProductsPageSettingsComponent', () => {
  let component: ProductsPageSettingsComponent;
  let fixture: ComponentFixture<ProductsPageSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsPageSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsPageSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
