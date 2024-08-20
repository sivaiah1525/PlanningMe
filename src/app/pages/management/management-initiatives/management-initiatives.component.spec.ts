import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementInitiativesComponent } from './management-initiatives.component';

describe('ManagementInitiativesComponent', () => {
  let component: ManagementInitiativesComponent;
  let fixture: ComponentFixture<ManagementInitiativesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementInitiativesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementInitiativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
