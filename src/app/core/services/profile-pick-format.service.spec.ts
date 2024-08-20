import { TestBed } from '@angular/core/testing';

import { ProfilePickFormatService } from './profile-pick-format.service';

describe('ProfilePickFormatService', () => {
  let service: ProfilePickFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfilePickFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
