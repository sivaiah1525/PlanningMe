import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { CreateMilestoneComponent } from '../create-milestone/create-milestone.component';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { MessageService } from 'src/app/core/services/message.service';
import { ApiErrorMessagesComponent } from 'src/app/api-error-messages/api-error-messages.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-create',
  templateUrl: './manage-create.component.html',
  styleUrls: ['./manage-create.component.scss']
})
export class ManageCreateComponent implements OnInit {


  constructor(
    private dialog: MatDialog,
    private calendarService: CalendarService,
    private messageService: MessageService,
    private _snackBar: MatSnackBar,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<ManageCreateComponent>,

  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }



  radioChange(value:any,type:any) {
    // AddNotesComponent 
    if (value === 1) {
      const createTask = this.dialog.open(CreateTaskComponent,
        {
          data: { data: this.data.data, type:type},
          disableClose: true,
          width: '500px',
          panelClass: ['addNotes'],
        });
        createTask.afterClosed().subscribe((result) => {
          if(result){
            console.log(result)
            this.matDialogRef.close(true)
          }
         
        })
    }
    // AddFileComponent 
    else {
      const createMilestone = this.dialog.open(CreateMilestoneComponent, {
        disableClose: true,
        width: '500px',
        panelClass: ['addFiles'],
        data: { data: this.data.data, type:type},
      });
      createMilestone.afterClosed().subscribe((result) => {
        console.log(result)
        this.matDialogRef.close(true)
      })
    }

  }

  APIerrormessage(message:any, header:any) {
    this.dialog.open(ApiErrorMessagesComponent, {
      width: '550px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }

}
