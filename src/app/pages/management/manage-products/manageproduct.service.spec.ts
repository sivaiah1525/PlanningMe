import { TestBed } from '@angular/core/testing';

import { ManageproductService } from './manageproduct.service';

describe('ManageproductService', () => {
  let service: ManageproductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageproductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
