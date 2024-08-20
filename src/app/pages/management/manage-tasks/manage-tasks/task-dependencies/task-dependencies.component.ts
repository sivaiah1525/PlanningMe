import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { MessageService } from 'src/app/core/services/message.service';
import { ContactDetailsComponent } from '../../../manage-contacts/contact-details/contact-details.component';
import { SiteDetailsComponent } from '../../../manage-sites/site-details/site-details.component';

@Component({
  selector: 'app-task-dependencies',
  templateUrl: './task-dependencies.component.html',
  styleUrls: ['./task-dependencies.component.scss']
})
export class TaskDependenciesComponent implements OnInit {
  Dependencieslist=[]
  screenType=''
  constructor(
    private dialog: MatDialog,
    private calendarService: CalendarService,
    private messageService: MessageService,
    private _snackBar: MatSnackBar,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<TaskDependenciesComponent>,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.Dependencieslist=this.data.data
    this.screenType=this.data.type
  }



  radioChange(value:any){
    this.matDialogRef.close(value)
  }

  radioChange1(data:any ,type:any){
    this.matDialogRef.close(data)
    this.ShowSiteDetails(data,type)
  }


  // ShowSiteDetails
  ShowSiteDetails(row:any, type: string): void {
    this.dialog.open(SiteDetailsComponent, {
      disableClose: true,
      data: { data: row, type: type },
      width: '500px',
      position: { top: '150px', left: '700px' },
    });
  }


}
