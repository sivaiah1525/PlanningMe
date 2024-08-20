import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { DialogData } from 'src/app/pages/calendar/calendar.component';
import { EventProposalComponent } from '../event-proposal-calender/event.proposal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-proposal',
  templateUrl: './edit-proposal.component.html',
  styleUrls: ['./edit-proposal.component.scss']
})
export class EditProposalComponent implements OnInit {
eventProposalArray :any= [];
userId:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
    private calendarService: CalendarService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<EditProposalComponent>,
    private translate: TranslateService ,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }   
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('id');

    this.calendarService.FindEventProposalsByEventId(this.data.eventId).subscribe((res) => {
      if (res)
      this.eventProposalArray = res;
    });
  }

  invitedEventUpdate(id:any, evId:any) {
    this.calendarService.acceptRejectEventProposal(id, evId,this.userId).subscribe((res) => {
      console.log(res.response[0].message);
      this._snackBar.open(res.response[0].message, '', {
        duration: 2000,
      });
      this.dialogRef.close();
      window.location.reload();
     this.router.navigate(['/home/app/calendar']);
    })
  }

  proposeNewEvent(event:any) {
    const eventInfo = {
      'id':event.eventId,
      'start':event.newStartDate,
      'end':event.newEndDate
    }
    sessionStorage.setItem('startdate',event.newStartDate);
    sessionStorage.setItem('eventInfo',JSON.stringify(eventInfo));
    const dialogRef = this.dialog.open(EventProposalComponent, {
      width: '900px',
      height: '500px',
            data: {eventId: event.eventId}
    });
  }
}
