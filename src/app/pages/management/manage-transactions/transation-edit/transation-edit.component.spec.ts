import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransationEditComponent } from './transation-edit.component';

describe('TransationEditComponent', () => {
  let component: TransationEditComponent;
  let fixture: ComponentFixture<TransationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
