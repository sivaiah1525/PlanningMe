import { TestBed } from '@angular/core/testing';

import { GmailsService } from './gmails.service';

describe('GmailsService', () => {
  let service: GmailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GmailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
