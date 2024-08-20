import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesAndNotesShareLinkComponent } from './files-and-notes-share-link.component';

describe('FilesAndNotesShareLinkComponent', () => {
  let component: FilesAndNotesShareLinkComponent;
  let fixture: ComponentFixture<FilesAndNotesShareLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesAndNotesShareLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesAndNotesShareLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
