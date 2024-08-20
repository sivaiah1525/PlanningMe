import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichiersNotesComponent } from './fichiers-notes.component';

describe('FichiersNotesComponent', () => {
  let component: FichiersNotesComponent;
  let fixture: ComponentFixture<FichiersNotesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FichiersNotesComponent]
    });
    fixture = TestBed.createComponent(FichiersNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
