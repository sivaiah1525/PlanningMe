import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedDataResultComponent } from './imported-data-result.component';

describe('ImportedDataResultComponent', () => {
  let component: ImportedDataResultComponent;
  let fixture: ComponentFixture<ImportedDataResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportedDataResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportedDataResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
