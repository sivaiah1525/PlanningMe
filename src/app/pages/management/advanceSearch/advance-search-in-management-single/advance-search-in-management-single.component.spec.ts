import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSearchInManagementSingleComponent } from './advance-search-in-management-single.component';

describe('AdvanceSearchInManagementSingleComponent', () => {
  let component: AdvanceSearchInManagementSingleComponent;
  let fixture: ComponentFixture<AdvanceSearchInManagementSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceSearchInManagementSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceSearchInManagementSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
