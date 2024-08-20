import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessPageForOtherUserComponent } from './success-page-for-other-user.component';

describe('SuccessPageForOtherUserComponent', () => {
  let component: SuccessPageForOtherUserComponent;
  let fixture: ComponentFixture<SuccessPageForOtherUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessPageForOtherUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessPageForOtherUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
