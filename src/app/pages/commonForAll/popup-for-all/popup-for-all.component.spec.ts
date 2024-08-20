import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupForAllComponent } from './popup-for-all.component';

describe('PopupForAllComponent', () => {
  let component: PopupForAllComponent;
  let fixture: ComponentFixture<PopupForAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupForAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupForAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
