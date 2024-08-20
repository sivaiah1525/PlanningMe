import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDependenciesComponent } from './task-dependencies.component';

describe('TaskDependenciesComponent', () => {
  let component: TaskDependenciesComponent;
  let fixture: ComponentFixture<TaskDependenciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskDependenciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDependenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
