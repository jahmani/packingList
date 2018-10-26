import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingRowComponent } from './packing-row.component';

describe('PackingRowComponent', () => {
  let component: PackingRowComponent;
  let fixture: ComponentFixture<PackingRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
