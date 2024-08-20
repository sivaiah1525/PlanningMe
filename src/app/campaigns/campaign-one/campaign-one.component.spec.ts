import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignOneComponent } from './campaign-one.component';

describe('CampaignOneComponent', () => {
  let component: CampaignOneComponent;
  let fixture: ComponentFixture<CampaignOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
