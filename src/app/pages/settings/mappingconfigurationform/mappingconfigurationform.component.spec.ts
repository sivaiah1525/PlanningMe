import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingconfigurationformComponent } from './mappingconfigurationform.component';

describe('MappingconfigurationformComponent', () => {
  let component: MappingconfigurationformComponent;
  let fixture: ComponentFixture<MappingconfigurationformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappingconfigurationformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingconfigurationformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
