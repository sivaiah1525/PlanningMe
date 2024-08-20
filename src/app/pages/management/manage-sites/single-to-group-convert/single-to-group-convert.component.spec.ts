import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleToGroupConvertComponent } from './single-to-group-convert.component';

describe('SingleToGroupConvertComponent', () => {
  let component: SingleToGroupConvertComponent;
  let fixture: ComponentFixture<SingleToGroupConvertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleToGroupConvertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleToGroupConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
