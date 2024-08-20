import { TestBed } from '@angular/core/testing';

import { FiltershareService } from './filtershare.service';

describe('FiltershareService', () => {
  let service: FiltershareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiltershareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
