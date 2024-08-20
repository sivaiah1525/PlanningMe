import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPipelineComponent } from './select-pipeline.component';

describe('SelectPipelineComponent', () => {
  let component: SelectPipelineComponent;
  let fixture: ComponentFixture<SelectPipelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPipelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPipelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
