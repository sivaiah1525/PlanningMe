import { TestBed } from '@angular/core/testing';

import { FindTransactionsByOrderIdService } from './find-transactions-by-order-id.service';

describe('FindTransactionsByOrderIdService', () => {
  let service: FindTransactionsByOrderIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindTransactionsByOrderIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
