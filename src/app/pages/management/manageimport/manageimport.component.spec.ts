import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageimportComponent } from './manageimport.component';

describe('ManageimportComponent', () => {
  let component: ManageimportComponent;
  let fixture: ComponentFixture<ManageimportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageimportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
