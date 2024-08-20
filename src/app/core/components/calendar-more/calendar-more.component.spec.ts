import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarMoreComponent } from '../calendar-more/calendar-more.component';

describe('CalendarMorePage', () => {
  let component: CalendarMoreComponent;
  let fixture: ComponentFixture<CalendarMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarMoreComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
