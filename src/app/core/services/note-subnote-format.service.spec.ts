import { TestBed } from '@angular/core/testing';

import { NoteSubnoteFormatService } from './note-subnote-format.service';

describe('NoteSubnoteFormatService', () => {
  let service: NoteSubnoteFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteSubnoteFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
