import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SynchronizationDataComponent } from 'src/app/core/components/synchronization-data/synchronization-data.component';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { GoogleCalenderService } from 'src/app/core/services/SYNC/google-calender.service';
import { OutlookCalenderService } from 'src/app/core/services/SYNC/outlook-calender.service';

@Component({
  selector: 'app-planning-synchronisation',
  templateUrl: './planning-synchronisation.component.html',
  styleUrls: ['./planning-synchronisation.component.scss']
})
export class PlanningSynchronisationComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  spinner = false
  screenType = ''
  constructor(
    private calendarService: CalendarService,
    private outlookcalender: OutlookCalenderService,
    private GoogleCalender: GoogleCalenderService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,

  ) { }


  ngOnInit(): void {
    if (this.data.screenType) {
      this.screenType = this.data.screenType
    }
  }





  tabChange(tabIndex: number): void {
    console.log(tabIndex);
  }


  importGoogleCalenderdata() {
    this.spinner = true
    this.calendarService.GoogleOAuthRedirect().subscribe((result: any) => {
      if (result) {
        this.spinner = false
        window.open(result.redirectUrl.url)
        this.ExportGoogleCalenderdata()
      }
    })
  }

  importOutLookCalenderdata() {
    this.spinner = true
    this.calendarService.OutlookOAuthRedirect().subscribe((result: any) => {
      if (result) {
        this.spinner = false
        window.open(result.redirectUrl.url)
      }
    })
  }


  ExportGoogleCalenderdata() {
    this.calendarService.GoogleExort().subscribe((result: any) => {
      if (result) {
        console.log(result)
      }
    })
  }



  GoogleCalenders() {
     if(this.screenType=='Moreoption'){
          this.checkgoogleouthAccessToken('GoogleCalender')
     }else{
      this.GoogleCalender.loginpage()
     }
  }

  OutLookCalender() {
    if(this.screenType=='Moreoption'){
     this.checkgoogleouthAccessToken('OutLookCalender')
    }else{
      this.outlookcalender.loginpage()
    }

  }



  checkgoogleouthAccessToken(ActionName:any){
    const viewDialog=this.dialog.open(SynchronizationDataComponent, {
      width: '100%',
      data: { ScreenType:'PlanningPage',ActionName:ActionName},
      autoFocus: false,
      disableClose: true,
    });
    viewDialog.afterClosed().subscribe((result) => {
      if (result) {
        if(ActionName=='GoogleCalender'){
          this.calendarService.ImportGoogleCalendarEvents(result.accessToken).subscribe((result)=>{
            if(result){
              window.open(window.location.href)

            }
          })
        }else if(ActionName=='OutLookCalender'){
            this.calendarService.ImportOutlookCalendarEvents(result.accessToken).subscribe((result)=>{
              if(result){
                window.open(window.location.href)
              }
            })
        }

      }
    });
  }

}
