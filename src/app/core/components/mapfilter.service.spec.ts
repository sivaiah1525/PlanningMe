import { TestBed } from '@angular/core/testing';

import { MapfilterService } from './mapfilter.service';

describe('MapfilterService', () => {
  let service: MapfilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapfilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
