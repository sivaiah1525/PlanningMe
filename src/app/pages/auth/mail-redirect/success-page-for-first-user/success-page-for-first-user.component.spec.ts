import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessPageForFirstUserComponent } from './success-page-for-first-user.component';

describe('SuccessPageForFirstUserComponent', () => {
  let component: SuccessPageForFirstUserComponent;
  let fixture: ComponentFixture<SuccessPageForFirstUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessPageForFirstUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessPageForFirstUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
