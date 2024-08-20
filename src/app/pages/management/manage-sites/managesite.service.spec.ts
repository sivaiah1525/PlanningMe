import { TestBed } from '@angular/core/testing';

import { ManagesiteService } from './managesite.service';

describe('ManagesiteService', () => {
  let service: ManagesiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagesiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
