import { TestBed } from '@angular/core/testing';

import { CheckOrganationTypeService } from './check-organation-type.service';

describe('CheckOrganationTypeService', () => {
  let service: CheckOrganationTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckOrganationTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
