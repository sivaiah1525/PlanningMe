import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePriceMatrixComponent } from './create-price-matrix.component';

describe('CreatePriceMatrixComponent', () => {
  let component: CreatePriceMatrixComponent;
  let fixture: ComponentFixture<CreatePriceMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePriceMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePriceMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
