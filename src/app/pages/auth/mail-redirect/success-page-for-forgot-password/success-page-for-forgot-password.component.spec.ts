import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessPageForForgotPasswordComponent } from './success-page-for-forgot-password.component';

describe('SuccessPageForForgotPasswordComponent', () => {
  let component: SuccessPageForForgotPasswordComponent;
  let fixture: ComponentFixture<SuccessPageForForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessPageForForgotPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessPageForForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
