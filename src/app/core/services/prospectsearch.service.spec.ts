import { TestBed } from '@angular/core/testing';

import { ProspectsearchService } from './prospectsearch.service';

describe('ProspectsearchService', () => {
  let service: ProspectsearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProspectsearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
