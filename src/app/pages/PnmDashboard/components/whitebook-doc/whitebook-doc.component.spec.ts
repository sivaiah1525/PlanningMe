import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhitebookDocComponent } from './whitebook-doc.component';

describe('WhitebookDocComponent', () => {
  let component: WhitebookDocComponent;
  let fixture: ComponentFixture<WhitebookDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhitebookDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhitebookDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
