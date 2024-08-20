import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicKeywordsComponent } from './dynamic-keywords.component';

describe('DynamicKeywordsComponent', () => {
  let component: DynamicKeywordsComponent;
  let fixture: ComponentFixture<DynamicKeywordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicKeywordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicKeywordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
