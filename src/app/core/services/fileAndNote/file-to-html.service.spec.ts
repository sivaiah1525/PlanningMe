import { TestBed } from '@angular/core/testing';

import { FileToHtmlService } from './file-to-html.service';

describe('FileToHtmlService', () => {
  let service: FileToHtmlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileToHtmlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
