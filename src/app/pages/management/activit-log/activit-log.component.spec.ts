import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitLogComponent } from './activit-log.component';

describe('ActivitLogComponent', () => {
  let component: ActivitLogComponent;
  let fixture: ComponentFixture<ActivitLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
