import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDownloadShareComponent } from './file-download-share.component';

describe('FileDownloadShareComponent', () => {
  let component: FileDownloadShareComponent;
  let fixture: ComponentFixture<FileDownloadShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileDownloadShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDownloadShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
