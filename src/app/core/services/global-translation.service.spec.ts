import { TestBed } from '@angular/core/testing';

import { GlobalTranslationService } from './global-translation.service';

describe('GlobalTranslationService', () => {
  let service: GlobalTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalTranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
