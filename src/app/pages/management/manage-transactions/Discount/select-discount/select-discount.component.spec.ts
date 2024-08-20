import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDiscountComponent } from './select-discount.component';

describe('SelectDiscountComponent', () => {
  let component: SelectDiscountComponent;
  let fixture: ComponentFixture<SelectDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
