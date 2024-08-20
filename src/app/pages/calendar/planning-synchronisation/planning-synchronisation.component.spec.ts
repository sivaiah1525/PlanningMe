import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningSynchronisationComponent } from './planning-synchronisation.component';

describe('PlanningSynchronisationComponent', () => {
  let component: PlanningSynchronisationComponent;
  let fixture: ComponentFixture<PlanningSynchronisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningSynchronisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningSynchronisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
