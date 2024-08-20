import { TestBed } from '@angular/core/testing';

import { ManagecontactService } from './managecontact.service';

describe('ManagecontactService', () => {
  let service: ManagecontactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagecontactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
