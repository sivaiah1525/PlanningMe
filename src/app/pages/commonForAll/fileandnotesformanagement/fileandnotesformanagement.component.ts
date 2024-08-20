import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-fileandnotesformanagement',
  templateUrl: './fileandnotesformanagement.component.html',
  styleUrls: ['./fileandnotesformanagement.component.scss']
})
export class FileandnotesformanagementComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<FileandnotesformanagementComponent>,

  ) { }

  ngOnInit(): void {

  }






  radioChange(value:any) {
    this.dialogRef.close(value)
  }
}
