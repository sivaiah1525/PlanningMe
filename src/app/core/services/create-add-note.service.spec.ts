import { TestBed } from '@angular/core/testing';

import { CreateAddNoteService } from './create-add-note.service';

describe('CreateAddNoteService', () => {
  let service: CreateAddNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateAddNoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
