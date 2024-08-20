import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncOptionsListComponent } from './sync-options-list.component';

describe('SyncOptionsListComponent', () => {
  let component: SyncOptionsListComponent;
  let fixture: ComponentFixture<SyncOptionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncOptionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncOptionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
