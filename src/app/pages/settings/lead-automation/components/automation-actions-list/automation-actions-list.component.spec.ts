import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationActionsListComponent } from './automation-actions-list.component';

describe('AutomationActionsListComponent', () => {
  let component: AutomationActionsListComponent;
  let fixture: ComponentFixture<AutomationActionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutomationActionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomationActionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
