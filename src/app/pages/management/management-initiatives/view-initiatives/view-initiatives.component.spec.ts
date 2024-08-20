import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInitiativesComponent } from './view-initiatives.component';

describe('ViewInitiativesComponent', () => {
  let component: ViewInitiativesComponent;
  let fixture: ComponentFixture<ViewInitiativesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInitiativesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInitiativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
