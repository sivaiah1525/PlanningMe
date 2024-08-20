import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleAndGroupForDropdownSelactionComponent } from './single-and-group-for-dropdown-selaction.component';

describe('SingleAndGroupForDropdownSelactionComponent', () => {
  let component: SingleAndGroupForDropdownSelactionComponent;
  let fixture: ComponentFixture<SingleAndGroupForDropdownSelactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleAndGroupForDropdownSelactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleAndGroupForDropdownSelactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
