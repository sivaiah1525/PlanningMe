import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiErrorResponseComponent } from './api-error-response.component';

describe('ApiErrorResponseComponent', () => {
  let component: ApiErrorResponseComponent;
  let fixture: ComponentFixture<ApiErrorResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiErrorResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiErrorResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
