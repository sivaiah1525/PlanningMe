import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCardDetailsComponent } from './payment-card-details.component';

describe('PaymentCardDetailsComponent', () => {
  let component: PaymentCardDetailsComponent;
  let fixture: ComponentFixture<PaymentCardDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentCardDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
