import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrosoftAuthRedirectComponent } from './microsoft-auth-redirect.component';

describe('MicrosoftAuthRedirectComponent', () => {
  let component: MicrosoftAuthRedirectComponent;
  let fixture: ComponentFixture<MicrosoftAuthRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicrosoftAuthRedirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicrosoftAuthRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
