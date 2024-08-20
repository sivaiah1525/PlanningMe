import { Component, Inject, OnInit } from '@angular/core';
import { SyncOptionsListComponent } from '../sync-options-list/sync-options-list.component';
import { GoogleApiService } from 'src/app/core/services/SYNC/google-api.service';
import { CalendarService } from '../../services/calendar.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PlanningSynchronisationComponent } from 'src/app/pages/calendar/planning-synchronisation/planning-synchronisation.component';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';

@Component({
  selector: 'app-synchronization-data',
  templateUrl: './synchronization-data.component.html',
  styleUrls: ['./synchronization-data.component.scss']
})
export class SynchronizationDataComponent implements OnInit {
  isChecked = true
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  spinner = false
  AllSynchronizationData: any = []
  screenType = ''
  ActionName = ''
  ApplicationIds = '1,2,3,4'
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private calendarService: CalendarService,
    private goole: GoogleApiService,
    private dialog: MatDialog,
    private matDialogRef: MatDialogRef<SynchronizationDataComponent>,

  ) { }

  ngOnInit(): void {
    this.screenType = this.data.ScreenType
    this.ActionName = this.data?.ActionName
    if (this.ActionName == 'GoogleDrive') {
      this.ApplicationIds = '1'
    } else if (this.ActionName == 'Onedrive') {
      this.ApplicationIds = '3'
    } else if (this.ActionName == 'Gmail') {
      this.ApplicationIds = '2'
    } else if (this.ActionName == 'Outlook') {
      this.ApplicationIds = '4'
    } else if (this.ActionName == 'GoogleCalender') {
      this.ApplicationIds = '5'
    } else if (this.ActionName == 'OutLookCalender') {
      this.ApplicationIds = '6'
    } else if (this.screenType == 'FilesAndNotesPage') {
      this.ApplicationIds = '1,2,3,4'
    } else if (this.screenType == 'PlanningPage') {
      this.ApplicationIds = '5,6'
    }else if(this.ActionName == 'Drive'){
      this.ApplicationIds = '1,3'
    }
    console.log(this.data)
    this.getAllSyncAccDetais()
  }


  getAllSyncAccDetais() {
    // GoogleDrive=1 Gmail=2 OneDrive=3 Outlook=4 GoogleCalender=5 OutLookCalender=6
    this.goole.GetSyncAccDetais(this.ApplicationIds).subscribe((result) => {
      if (result) {
        this.AllSynchronizationData = result
        console.log(result)
      }
    })
  }

  deleteAccount(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type } });
    deleteorder.afterClosed().subscribe((result: any) => {
      if (result)
        this.getAllSyncAccDetais()
    })
  }


  SynchronisationComponent1() {
    this.dialog.open(SyncOptionsListComponent, {
      autoFocus: false,
      disableClose: true,
    });
  }

  addASynchronization() {
    if (this.screenType == 'FilesAndNotesPage') {
      this.SynchronisationComponent1()
    } else {
      this.SynchronisationComponent2()
    }
  }



  SynchronisationComponent2() {
    this.dialog.open(PlanningSynchronisationComponent, {
      width: '500px',
    })
  }




  gettingonAsstoken(data:any) {
    console.log(data)
    if (data.applicationName == 'GoogleDrive' || data.applicationName == 'Gmail' || data.applicationName == 'GoogleCalender') {
      this.goole.GetGoogleAccessTokenByRF(data.id).subscribe((result:any) => {
        if (result) {
          result.applicationName=data.applicationName
          this.matDialogRef.close(result)
        }
      })
    } else if (data.applicationName == 'OneDrive' || data.applicationName == 'Outlook' || data.applicationName == 'OutLookCalender') {
      this.goole.GetMicrosoftAccessTokenByRF(data.id).subscribe((result:any) => {
        if (result) {
          result.applicationName=data.applicationName
          this.matDialogRef.close(result)
        }
      })
    }
  }

}
