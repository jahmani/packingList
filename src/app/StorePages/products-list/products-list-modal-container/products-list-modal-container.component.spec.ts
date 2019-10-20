import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsListModalContainerComponent } from './products-list-modal-container.component';

describe('ProductsListModalContainerComponent', () => {
  let component: ProductsListModalContainerComponent;
  let fixture: ComponentFixture<ProductsListModalContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsListModalContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListModalContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
