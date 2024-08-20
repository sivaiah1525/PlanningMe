import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTaskKanbanComponent } from './update-task-kanban.component';

describe('UpdateTaskKanbanComponent', () => {
  let component: UpdateTaskKanbanComponent;
  let fixture: ComponentFixture<UpdateTaskKanbanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTaskKanbanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTaskKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
