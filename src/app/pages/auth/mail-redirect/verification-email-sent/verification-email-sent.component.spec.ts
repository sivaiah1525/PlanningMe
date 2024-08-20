import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationEmailSentComponent } from './verification-email-sent.component';

describe('VerificationEmailSentComponent', () => {
  let component: VerificationEmailSentComponent;
  let fixture: ComponentFixture<VerificationEmailSentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationEmailSentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationEmailSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
