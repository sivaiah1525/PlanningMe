import { TestBed } from '@angular/core/testing';

import { GoogleValidationAddressService } from './google-validation-address.service';

describe('GoogleValidationAddressService', () => {
  let service: GoogleValidationAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleValidationAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
