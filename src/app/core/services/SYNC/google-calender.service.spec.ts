import { TestBed } from '@angular/core/testing';

import { GoogleCalenderService } from './google-calender.service';

describe('GoogleCalenderService', () => {
  let service: GoogleCalenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleCalenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
