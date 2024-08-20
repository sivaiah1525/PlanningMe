import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDiscountDetailsComponent } from './view-discount-details.component';

describe('ViewDiscountDetailsComponent', () => {
  let component: ViewDiscountDetailsComponent;
  let fixture: ComponentFixture<ViewDiscountDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDiscountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDiscountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
