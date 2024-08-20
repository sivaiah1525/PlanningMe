import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiSuccessMessagesComponent } from './api-success-messages.component';

describe('ApiSuccessMessagesComponent', () => {
  let component: ApiSuccessMessagesComponent;
  let fixture: ComponentFixture<ApiSuccessMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiSuccessMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiSuccessMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
