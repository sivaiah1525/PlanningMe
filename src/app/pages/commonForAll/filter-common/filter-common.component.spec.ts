import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCommonComponent } from './filter-common.component';

describe('FilterCommonComponent', () => {
  let component: FilterCommonComponent;
  let fixture: ComponentFixture<FilterCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
