import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessFileNotesComponent } from './access-file-notes.component';

describe('AccessFileNotesComponent', () => {
  let component: AccessFileNotesComponent;
  let fixture: ComponentFixture<AccessFileNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessFileNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessFileNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
