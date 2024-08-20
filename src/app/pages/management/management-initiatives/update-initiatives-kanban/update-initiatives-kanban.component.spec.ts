import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInitiativesKanbanComponent } from './update-initiatives-kanban.component';

describe('UpdateInitiativesKanbanComponent', () => {
  let component: UpdateInitiativesKanbanComponent;
  let fixture: ComponentFixture<UpdateInitiativesKanbanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateInitiativesKanbanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateInitiativesKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
