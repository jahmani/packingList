import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLineViewComponent } from './product-line-view.component';

describe('ProductLineViewComponent', () => {
  let component: ProductLineViewComponent;
  let fixture: ComponentFixture<ProductLineViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLineViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLineViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
