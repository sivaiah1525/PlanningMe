import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContactGroupComponent } from './edit-contact-group.component';

describe('EditContactGroupComponent', () => {
  let component: EditContactGroupComponent;
  let fixture: ComponentFixture<EditContactGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditContactGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContactGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
