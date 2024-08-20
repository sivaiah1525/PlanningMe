import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTargetComponent } from './view-target';

describe('ViewTaskComponent', () => {
  let component: ViewTargetComponent;
  let fixture: ComponentFixture<ViewTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
