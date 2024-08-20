import { TestBed } from '@angular/core/testing';

import { FindfiletypeService } from './findfiletype.service';

describe('FindfiletypeService', () => {
  let service: FindfiletypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindfiletypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
