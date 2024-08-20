import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NitificationsRightsComponent } from './nitifications-rights.component';

describe('NitificationsRightsComponent', () => {
  let component: NitificationsRightsComponent;
  let fixture: ComponentFixture<NitificationsRightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NitificationsRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NitificationsRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
