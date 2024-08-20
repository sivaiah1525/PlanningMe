import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFileNotesComponent } from './add-file-notes.component';

describe('AddFileNotesComponent', () => {
  let component: AddFileNotesComponent;
  let fixture: ComponentFixture<AddFileNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFileNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFileNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
