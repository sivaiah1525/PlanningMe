import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtagCommonComponent } from './addtag-common.component';

describe('AddtagCommonComponent', () => {
  let component: AddtagCommonComponent;
  let fixture: ComponentFixture<AddtagCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddtagCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddtagCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
