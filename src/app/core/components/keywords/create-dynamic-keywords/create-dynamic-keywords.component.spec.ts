import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDynamicKeywordsComponent } from './create-dynamic-keywords.component';

describe('CreateDynamicKeywordsComponent', () => {
  let component: CreateDynamicKeywordsComponent;
  let fixture: ComponentFixture<CreateDynamicKeywordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDynamicKeywordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDynamicKeywordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
