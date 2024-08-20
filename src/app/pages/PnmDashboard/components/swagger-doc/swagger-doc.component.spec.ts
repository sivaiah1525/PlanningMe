import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwaggerDocComponent } from './swagger-doc.component';

describe('SwaggerDocComponent', () => {
  let component: SwaggerDocComponent;
  let fixture: ComponentFixture<SwaggerDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwaggerDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwaggerDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
