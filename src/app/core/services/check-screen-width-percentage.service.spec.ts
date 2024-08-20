import { TestBed } from '@angular/core/testing';

import { CheckScreenWidthPercentageService } from './check-screen-width-percentage.service';

describe('CheckScreenWidthPercentageService', () => {
  let service: CheckScreenWidthPercentageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckScreenWidthPercentageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
