import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountHistoryComponent } from './discount-history.component';

describe('DiscountHistoryComponent', () => {
  let component: DiscountHistoryComponent;
  let fixture: ComponentFixture<DiscountHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
