import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynchronizationDataComponent } from './synchronization-data.component';

describe('SynchronizationDataComponent', () => {
  let component: SynchronizationDataComponent;
  let fixture: ComponentFixture<SynchronizationDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SynchronizationDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SynchronizationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
