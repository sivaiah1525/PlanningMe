import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCommomComponent } from './delete-commom.component';

describe('DeleteCommomComponent', () => {
  let component: DeleteCommomComponent;
  let fixture: ComponentFixture<DeleteCommomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteCommomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCommomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
