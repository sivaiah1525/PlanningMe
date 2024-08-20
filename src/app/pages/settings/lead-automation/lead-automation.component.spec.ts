import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadAutomationComponent } from './lead-automation.component';

describe('LeadAutomationComponent', () => {
  let component: LeadAutomationComponent;
  let fixture: ComponentFixture<LeadAutomationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadAutomationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadAutomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
