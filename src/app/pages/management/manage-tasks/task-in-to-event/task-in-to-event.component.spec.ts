import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskInToEventComponent } from './task-in-to-event.component';

describe('TaskInToEventComponent', () => {
  let component: TaskInToEventComponent;
  let fixture: ComponentFixture<TaskInToEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskInToEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskInToEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
