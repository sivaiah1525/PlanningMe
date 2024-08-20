import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiErrorMessagesComponent } from './api-error-messages.component';

describe('ApiErrorMessagesComponent', () => {
  let component: ApiErrorMessagesComponent;
  let fixture: ComponentFixture<ApiErrorMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiErrorMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiErrorMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
