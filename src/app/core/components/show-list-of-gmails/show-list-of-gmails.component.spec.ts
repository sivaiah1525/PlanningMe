import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowListOfGmailsComponent } from './show-list-of-gmails.component';

describe('ShowListOfGmailsComponent', () => {
  let component: ShowListOfGmailsComponent;
  let fixture: ComponentFixture<ShowListOfGmailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowListOfGmailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowListOfGmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
