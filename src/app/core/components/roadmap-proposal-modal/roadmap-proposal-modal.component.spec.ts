import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadmapProposalModalPage } from './roadmap-proposal-modal.page';

describe('RoadmapProposalModalPage', () => {
  let component: RoadmapProposalModalPage;
  let fixture: ComponentFixture<RoadmapProposalModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoadmapProposalModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadmapProposalModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
