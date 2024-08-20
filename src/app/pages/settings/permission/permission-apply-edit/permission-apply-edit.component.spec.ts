import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionApplyEditComponent } from './permission-apply-edit.component';

describe('PermissionApplyEditComponent', () => {
  let component: PermissionApplyEditComponent;
  let fixture: ComponentFixture<PermissionApplyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionApplyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionApplyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
