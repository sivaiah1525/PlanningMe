import { TestBed } from '@angular/core/testing';

import { ActivityReportDataFormatService } from './activity-report-data-format.service';

describe('ActivityReportDataFormatService', () => {
  let service: ActivityReportDataFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityReportDataFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
