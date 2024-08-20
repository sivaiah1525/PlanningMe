import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupErrorMessageComponent } from './popup-error-message.component';

describe('PopupErrorMessageComponent', () => {
  let component: PopupErrorMessageComponent;
  let fixture: ComponentFixture<PopupErrorMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupErrorMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
