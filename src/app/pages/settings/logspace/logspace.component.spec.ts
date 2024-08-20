import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogspaceComponent } from './logspace.component';

describe('LogspaceComponent', () => {
  let component: LogspaceComponent;
  let fixture: ComponentFixture<LogspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
