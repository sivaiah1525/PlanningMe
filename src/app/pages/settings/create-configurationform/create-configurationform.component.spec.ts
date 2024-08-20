import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConfigurationformComponent } from './create-configurationform.component';

describe('CreateConfigurationformComponent', () => {
  let component: CreateConfigurationformComponent;
  let fixture: ComponentFixture<CreateConfigurationformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateConfigurationformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateConfigurationformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
