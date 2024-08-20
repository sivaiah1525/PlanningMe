import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-api-success-messages',
  templateUrl: './api-success-messages.component.html',
  styleUrls: ['./api-success-messages.component.scss']
})
export class ApiSuccessMessagesComponent implements OnInit {

  message!: string;
  header!: string;
  trailUsers:boolean=false;
  DemoOrganationstatus:boolean=false
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private MatDialogRefDelet: MatDialogRef<ApiSuccessMessagesComponent>,
  ) { 

    this.trailUsers=localStorage.getItem('isTrailVersion')=='true'?true:false
    this.DemoOrganationstatus=localStorage.getItem('DemoOrganation')=='true'?true:false
  }

  ngOnInit(): void {
    this.message = this.data.message
    this.header = this.data.header
  }



  clearpopup(){
   this.MatDialogRefDelet.close(true)
  }

}
