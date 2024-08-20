import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSiteGroupComponent } from './edit-site-group.component';

describe('EditSiteGroupComponent', () => {
  let component: EditSiteGroupComponent;
  let fixture: ComponentFixture<EditSiteGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSiteGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSiteGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
