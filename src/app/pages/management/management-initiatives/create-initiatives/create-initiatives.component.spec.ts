import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInitiativesComponent } from './create-initiatives.component';

describe('CreateInitiativesComponent', () => {
  let component: CreateInitiativesComponent;
  let fixture: ComponentFixture<CreateInitiativesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateInitiativesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInitiativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
