import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRowsListComponent } from './order-rows-list.component';

describe('PackingListComponent', () => {
  let component: OrderRowsListComponent;
  let fixture: ComponentFixture<OrderRowsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRowsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRowsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
