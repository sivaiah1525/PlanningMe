import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportLogsComponent } from './export-logs.component';

describe('ExportLogsComponent', () => {
  let component: ExportLogsComponent;
  let fixture: ComponentFixture<ExportLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
