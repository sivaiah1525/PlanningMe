import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanTaskViewComponent } from './kanban-task-view.component';

describe('KanbanTaskViewComponent', () => {
  let component: KanbanTaskViewComponent;
  let fixture: ComponentFixture<KanbanTaskViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KanbanTaskViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanTaskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
