import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailConformationFailedComponent } from './mail-conformation-failed.component';

describe('MailConformationFailedComponent', () => {
  let component: MailConformationFailedComponent;
  let fixture: ComponentFixture<MailConformationFailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailConformationFailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailConformationFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
