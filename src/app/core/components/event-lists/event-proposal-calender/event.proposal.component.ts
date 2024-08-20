import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject, of } from 'rxjs';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay,
  CalendarView,
} from 'angular-calendar';
import { addDays, addHours, endOfMonth, endOfWeek, isSameDay, isSameMonth, startOfDay, startOfWeek, subDays } from 'date-fns';
import { first } from 'rxjs/operators';
import { MessageService } from 'src/app/core/services/message.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
export interface DialogData {
  eventId: string;
}

@Component({
  selector: 'event-proposal',
  templateUrl: './event.proposal.component.html',
  styleUrls: ['./event.proposal.component.scss']
})

export class EventProposalComponent implements OnInit {

  calendarView: string;
  CalendarView = CalendarView;
  viewDate: Date;
  startDate: any;
  endDate: any;
  availableUsersList:any= [];
  showavailableUsersList:any= [];
  showUsers: boolean = false;
  eventProposalObj: any;
  hideButton: boolean = true;
  dayStartHour = 8;
  snapDraggedEvents = true;
  eventLists:any;

  activeDayIsOpen = false;

  refresh: Subject<any> = new Subject();


  events: CalendarEvent[] = [];
  eventInfo!: CalendarEvent;
  smallDevice!: Observable<BreakpointState>;
  mediumDevice!: Observable<BreakpointState>;
  constructor(
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    public datepipe: DatePipe,
    private messageService: MessageService,
    private calendarService: CalendarService,
    public matDialogRef: MatDialogRef<EventProposalComponent>,
    private translate: TranslateService ,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
     this.calendarView = CalendarView.Week;
    this.viewDate = new Date();
  }

  ngOnInit() {
    localStorage.setItem("Screen", 'EventProposal');
    let startDateVal = new Date();
    this.startDate = startOfWeek(startDateVal);
    this.endDate = endOfWeek(startDateVal);
    this.startDate = this.datepipe.transform(this.startDate, 'yyyy-MM-dd');
    this.endDate = this.datepipe.transform(this.endDate, 'yyyy-MM-dd');
    // console.log(this.startDate,this.endDate,'startDateVal')
     let startdate:any=sessionStorage.getItem('startdate')
     let eventInfo:any=sessionStorage.getItem('eventInfo')
    this.viewDate = new Date(startdate);
    this.smallDevice = this.breakpointObserver.observe('(max-width: 576px)');
    this.mediumDevice = this.breakpointObserver.observe('(max-width: 992px)');
    this.eventInfo = JSON.parse(eventInfo);
    this.eventInfo.start = new Date(this.eventInfo.start);
    this.eventInfo.end = new Date(this.eventInfo.end);
    console.log(this.eventInfo.start, this.eventInfo.start);
    this.eventInfo.title = 'Available users';
    this.eventInfo.color = { 'primary': '#000', 'secondary': '#000' };
    this.eventInfo.id = this.eventInfo.id;
    console.log(this.eventInfo.id, 'this.eventInfo.id')
    // this.events.push(this.eventInfo);
    this.refresh.next();
    // this.refresh$.next();
    this.checkavailabledate();
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
    // this.refresh$.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log(event, action);
  }

  calendarViewChanged(value: string) {

    console.log(this.calendarView, 'calenderview');
    console.log(this.events)
  }
  eventClicked(eve:any) {
    console.log('event' + JSON.stringify(eve), eve);
    if (eve.title === 'Available users') {
      this.calendarService.FindAvailableUsersInEvents(eve.id, this.startDate, this.endDate).subscribe(data => {
        console.log(data, 'data')
        if (data) {
          this.availableUsersList = data;
          this.showUsers = true;
          this.eventProposalObj = {
            "id": 0,
            "eventId": eve.id,
            "newStartDate": this.startDate,
            "newEndDate": this.endDate,
            "acceptance": false,
            "reason": "some"
          }
        }
      });
    } else {
      this.showUsers = false;

    }
  }


  hourClicked(eve:any) {
    console.log(eve);
  }


  dayViewChanged(value: string) {
    this.calendarView = CalendarView.Week;
    console.log(value + 'siva2');
    let todayDate = new Date(value);
    let firstDay = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
    let lastDay = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0);
    console.log(lastDay.toDateString().split("T"));
    console.log(firstDay.toISOString().slice(0, 10));
    this.activeDayIsOpen = false;
    this.calendarService.fetchEventsByRange(firstDay.toISOString().slice(0, 10), lastDay.toISOString().slice(0, 10)).subscribe((res) => {
      console.log(res)
      this.eventLists = res;
    })
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }) {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        console.log(events)
        this.activeDayIsOpen = true;
      }
    }
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(cell => {
      const groups: any = {};
      cell.events.forEach((event:any) => {
        groups[event.meta.type] = groups[event.meta.type] || [];
        groups[event.meta.type].push(event);
      });
      // cell['eventGroups'] = Object.entries(groups);
    });
  }

  closedialogbox() {
    this.dialog.closeAll();
  }
  getstartInEvent(value:any) {
    this.startDate = value;
  }
  
  getUsersInEvent(value:any) {
    console.log(value, 'this.startDate');
    this.endDate = value
    if (this.startDate && this.endDate) {
      this.hideButton = false;
      if (this.eventInfo.title == 'Available users') {
        this.calendarService.FindAvailableUsersInEvents(this.eventInfo.id, this.startDate, this.endDate).subscribe(data => {
          if (data) {
            this.eventProposalObj = {
              "id": 0,
              "eventId": this.eventInfo.id,
              "newStartDate": this.startDate,
              "newEndDate": this.endDate,
              "acceptance": true,
              "reason": "some"
            }
          }
        });
        this.events.push({
          "start": new Date(this.startDate),
          "end": new Date(this.endDate),
          "title": "Available users",
          "id": this.eventInfo.id,
          "color": {
            "primary": '#BAB8B7',
            "secondary": '#BAB8B7'
          },
          "cssClass": 'black-box',

          "actions": [
            {
              "label": '<i class="fa fa-fw fa-pencil"></i>',
              'onClick': ({ event }: { event: any }): void => {
              }
            }
          ],
          "meta": {
            "type": "danger"
          }
        });
        console.log(this.events)
      }
      this.refresh.next();
    }
  }
  eventProposal() {
    // console.log(eve)
    this.calendarService.CreateEventProposal(this.eventProposalObj).subscribe((data:any) => {
      console.log(data);
      // alert('success');
      this.dialog.closeAll();
      this.messageService.showMessage(data['response'][0].message);
    })
  }


  checkavailabledate() {
    console.log(this.startDate, this.endDate)
    this.calendarService.FindAvailableUnavailableDates(this.eventInfo.id, this.startDate, this.endDate).subscribe(data => {
      console.log(data, 'data')
      if (data) {
        this.events.length = 0;
        this.events.push({
          "start": new Date(Object.keys(data.availableDates)[0]),
          "end": new Date(data.availableDates[Object.keys(data.availableDates)[0]]),
          "title": "Available dates",
          "id": this.eventInfo.id,
          "color": {
            "primary": '#d1e8ff',
            "secondary": '#d1e8ff'
          },
          "actions": [
            {
              "label": '<i class="fa fa-fw fa-pencil"></i>',
              'onClick': ({ event }: { event: any }): void => {
              }
            }
          ],
          "meta": {
            "type": "danger"
          }
        });
        console.log(this.events, 'events')
        if (data.unAvailableDates != null) {
          this.events.push({
            "start": new Date(Object.keys(data.unAvailableDates)[0]),
            "end": new Date(data.unAvailableDates[Object.keys(data.unAvailableDates)[0]]),
            "title": "UnAvailable dates",
            "id": this.eventInfo.id,
            "color": {
              "primary": "#f04141",
              "secondary": '#f04141'
            },
            "actions": [
              {
                "label": '<i class="fa fa-fw fa-pencil"></i>',
                'onClick': ({ event }: { event: any }): void => {
                }
              }
            ],
            "meta": {
              "type": "danger"
            }
          });
        }

      }
      console.log(this.events)
    });
  }

}