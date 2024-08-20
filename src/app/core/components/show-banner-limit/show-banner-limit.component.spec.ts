import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBannerLimitComponent } from './show-banner-limit.component';

describe('ShowBannerLimitComponent', () => {
  let component: ShowBannerLimitComponent;
  let fixture: ComponentFixture<ShowBannerLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowBannerLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowBannerLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
