import { TestBed } from '@angular/core/testing';

import { MatomoService } from './matomo-service.service';

describe('MatomoServiceService', () => {
  let service: MatomoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatomoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
