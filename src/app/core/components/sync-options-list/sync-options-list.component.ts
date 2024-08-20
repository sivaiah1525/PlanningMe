import { Component, OnInit } from '@angular/core';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { GmailsService } from 'src/app/core/services/SYNC/gmails.service';
import { GoogleDriveService } from 'src/app/core/services/SYNC/google-drive.service';
import { GoogleCalenderService } from 'src/app/core/services/SYNC/google-calender.service';
import { GoogleApiService } from 'src/app/core/services/SYNC/google-api.service';
import { OutlookService } from 'src/app/core/services/SYNC/outlook.service';
import { OneDriveService } from 'src/app/core/services/SYNC/one-drive.service';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-sync-options-list',
  templateUrl: './sync-options-list.component.html',
  styleUrls: ['./sync-options-list.component.scss']
})
export class SyncOptionsListComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  spinner=false
  constructor(
    private calendarService: CalendarService,
    private  goole:GoogleApiService,
    private matDialogRef: MatDialogRef<SyncOptionsListComponent>,
    private GoogleDrive:GoogleDriveService,
    private gmails:GmailsService,
    private GoogleCalender:GoogleCalenderService,
    private Outlook:OutlookService,
    private OneDrives:OneDriveService

  ) { }

  ngOnInit(): void {
  }

  

  Gmails(){
    this.gmails.loginpage()
  }

  googledrive(){
    this.GoogleDrive.loginpage()
  }




  OneDrive(){
    this.OneDrives.loginpage()
  }

  OutLook(){
    this.Outlook.loginpage()
  }
}
