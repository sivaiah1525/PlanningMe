import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseTaskOptionComponent } from './choose-task-option.component';

describe('ChooseTaskOptionComponent', () => {
  let component: ChooseTaskOptionComponent;
  let fixture: ComponentFixture<ChooseTaskOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseTaskOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseTaskOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
