import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileAndNoteChooseShareOptionComponent } from './file-and-note-choose-share-option.component';

describe('FileAndNoteChooseShareOptionComponent', () => {
  let component: FileAndNoteChooseShareOptionComponent;
  let fixture: ComponentFixture<FileAndNoteChooseShareOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileAndNoteChooseShareOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileAndNoteChooseShareOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
