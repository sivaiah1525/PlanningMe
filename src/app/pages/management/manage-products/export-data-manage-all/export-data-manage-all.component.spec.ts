import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDataManageAllComponent } from './export-data-manage-all.component';

describe('ExportDataManageAllComponent', () => {
  let component: ExportDataManageAllComponent;
  let fixture: ComponentFixture<ExportDataManageAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportDataManageAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportDataManageAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
