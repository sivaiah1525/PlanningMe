import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseUnitPriceHistoryComponent } from './base-unit-price-history.component';

describe('BaseUnitPriceHistoryComponent', () => {
  let component: BaseUnitPriceHistoryComponent;
  let fixture: ComponentFixture<BaseUnitPriceHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseUnitPriceHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseUnitPriceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
