import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PnmDashboardComponent } from './pnm-dashboard.component';

describe('PnmDashboardComponent', () => {
  let component: PnmDashboardComponent;
  let fixture: ComponentFixture<PnmDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PnmDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PnmDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
