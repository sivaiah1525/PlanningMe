import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenDayEventsModalPage } from './open-day-events-modal.page';

describe('OpenDayEventsModalPage', () => {
  let component: OpenDayEventsModalPage;
  let fixture: ComponentFixture<OpenDayEventsModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenDayEventsModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenDayEventsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
