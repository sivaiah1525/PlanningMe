import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPepoleComponent } from './other-pepole.component';

describe('OtherPepoleComponent', () => {
  let component: OtherPepoleComponent;
  let fixture: ComponentFixture<OtherPepoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherPepoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherPepoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
