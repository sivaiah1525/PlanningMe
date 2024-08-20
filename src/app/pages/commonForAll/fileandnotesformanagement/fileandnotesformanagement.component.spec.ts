import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileandnotesformanagementComponent } from './fileandnotesformanagement.component';

describe('FileandnotesformanagementComponent', () => {
  let component: FileandnotesformanagementComponent;
  let fixture: ComponentFixture<FileandnotesformanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileandnotesformanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileandnotesformanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
