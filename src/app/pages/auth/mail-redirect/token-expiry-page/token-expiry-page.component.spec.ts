import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenExpiryPageComponent } from './token-expiry-page.component';

describe('TokenExpiryPageComponent', () => {
  let component: TokenExpiryPageComponent;
  let fixture: ComponentFixture<TokenExpiryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenExpiryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenExpiryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
