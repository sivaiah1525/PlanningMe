import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicGroupComponentEditComponent } from './dynamic-group-component-edit.component';

describe('DynamicGroupComponentEditComponent', () => {
  let component: DynamicGroupComponentEditComponent;
  let fixture: ComponentFixture<DynamicGroupComponentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicGroupComponentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicGroupComponentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
