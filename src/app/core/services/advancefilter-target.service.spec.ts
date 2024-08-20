import { TestBed } from '@angular/core/testing';

import { AdvancefilterTargetService } from './advancefilter-target.service';

describe('AdvancefilterTargetService', () => {
  let service: AdvancefilterTargetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvancefilterTargetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
