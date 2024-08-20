import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativesStepperComponent } from './initiatives-stepper.component';

describe('InitiativesStepperComponent', () => {
  let component: InitiativesStepperComponent;
  let fixture: ComponentFixture<InitiativesStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiativesStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiativesStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
