import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRowEditorComponent } from './order-row-editor.component';

describe('OrderRowEditorComponent', () => {
  let component: OrderRowEditorComponent;
  let fixture: ComponentFixture<OrderRowEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRowEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRowEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
