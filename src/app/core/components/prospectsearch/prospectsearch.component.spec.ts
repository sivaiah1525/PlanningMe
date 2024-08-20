import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectsearchComponent } from './prospectsearch.component';

describe('ProspectsearchComponent', () => {
  let component: ProspectsearchComponent;
  let fixture: ComponentFixture<ProspectsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
