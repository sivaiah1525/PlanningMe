import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDetailsEditComponent } from './account-details-edit.component';

describe('AccountDetailsEditComponent', () => {
  let component: AccountDetailsEditComponent;
  let fixture: ComponentFixture<AccountDetailsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountDetailsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
