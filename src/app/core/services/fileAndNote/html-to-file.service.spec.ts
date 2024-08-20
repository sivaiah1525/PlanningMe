import { TestBed } from '@angular/core/testing';

import { HtmlToFileService } from './html-to-file.service';

describe('HtmlToFileService', () => {
  let service: HtmlToFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HtmlToFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
