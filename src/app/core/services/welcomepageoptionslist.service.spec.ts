import { TestBed } from '@angular/core/testing';

import { WelcomepageoptionslistService } from './welcomepageoptionslist.service';

describe('WelcomepageoptionslistService', () => {
  let service: WelcomepageoptionslistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WelcomepageoptionslistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
