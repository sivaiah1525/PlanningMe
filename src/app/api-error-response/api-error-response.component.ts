import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-api-error-response',
  templateUrl: './api-error-response.component.html',
  styleUrls: ['./api-error-response.component.scss']
})
export class ApiErrorResponseComponent implements OnInit {
  message!: string;
  header!: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private MatDialogRefDelet: MatDialogRef<ApiErrorResponseComponent>,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.message = this.data.message
    this.header = this.data.header
  }


  clearpopup(){
    this.MatDialogRefDelet.close(true)
   }
}
