import { TestBed } from '@angular/core/testing';

import { ManagetransactionService } from './managetransaction.service';

describe('ManagetransactionService', () => {
  let service: ManagetransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagetransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
