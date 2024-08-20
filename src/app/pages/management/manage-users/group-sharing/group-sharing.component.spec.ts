import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSharingComponent } from './group-sharing.component';

describe('GroupSharingComponent', () => {
  let component: GroupSharingComponent;
  let fixture: ComponentFixture<GroupSharingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSharingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
