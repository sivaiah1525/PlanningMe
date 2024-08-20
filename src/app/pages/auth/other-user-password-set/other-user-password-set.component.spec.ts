import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherUserPasswordSetComponent } from './other-user-password-set.component';

describe('OtherUserPasswordSetComponent', () => {
  let component: OtherUserPasswordSetComponent;
  let fixture: ComponentFixture<OtherUserPasswordSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherUserPasswordSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherUserPasswordSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
