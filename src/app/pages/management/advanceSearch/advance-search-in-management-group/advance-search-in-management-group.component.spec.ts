import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSearchInManagementGroupComponent } from './advance-search-in-management-group.component';

describe('AdvanceSearchInManagementGroupComponent', () => {
  let component: AdvanceSearchInManagementGroupComponent;
  let fixture: ComponentFixture<AdvanceSearchInManagementGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceSearchInManagementGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceSearchInManagementGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
