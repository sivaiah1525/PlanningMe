import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportFileNoteComponent } from './export-file-note.component';

describe('ExportFileNoteComponent', () => {
  let component: ExportFileNoteComponent;
  let fixture: ComponentFixture<ExportFileNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportFileNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportFileNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
