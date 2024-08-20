import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
import { addDays, addHours, endOfDay, endOfMonth, endOfWeek, isSameDay, isSameMonth, startOfDay, startOfMonth, startOfWeek, subDays } from 'date-fns';
import { first } from 'rxjs/operators';
import { MessageService } from 'src/app/core/services/message.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { EventPopUpDialog } from 'src/app/core/components/event-lists/event-lists.component';
import { ConformationComponent } from '../../management-initiatives/conformation/conformation.component';
export interface DialogData {
  eventId: string;
}
@Component({
  selector: 'app-task-in-to-event',
  templateUrl: './task-in-to-event.component.html',
  styleUrls: ['./task-in-to-event.component.scss']
})
export class TaskInToEventComponent implements OnInit {

  form: FormGroup;
  calendarView: string = 'week'
  CalendarView = CalendarView;
  viewDate: Date;
  startDate: any;
  endDate: any;
  availableUsersList:any= [];
  showavailableUsersList:any= [];
  showUsers: boolean = false;
  taskconvertObj: any;
  hideButton: boolean = true;
  dayStartHour = 8;
  snapDraggedEvents = true;
  eventLists:any=[];
  activeDayIsOpen = false;
  refresh: Subject<any> = new Subject();
  blackbox: boolean = false;
  currentdate=new Date()
  timeList = [
    '00:00',
    '00:15',
    '00:30',
    '00:45',
    '01:00',
    '01:15',
    '01:30',
    '01:45',
    '02:00',
    '02:15',
    '02:30',
    '02:45',
    '03:00',
    '03:15',
    '03:30',
    '03:45',
    '04:00',
    '04:15',
    '04:30',
    '04:45',
    '05:00',
    '05:15',
    '05:30',
    '05:45',
    '06:00',
    '06:15',
    '06:30',
    '06:45',
    '07:00',
    '07:15',
    '07:30',
    '07:45',
    '08:00',
    '08:15',
    '08:30',
    '08:45',
    '09:00',
    '09:15',
    '09:30',
    '09:45',
    '10:00',
    '10:15',
    '10:30',
    '10:45',
    '11:00',
    '11:15',
    '11:30',
    '11:45',
    '12:00',
    '12:15',
    '12:30',
    '12:45',
    '13:00',
    '13:15',
    '13:30',
    '13:45',
    '14:00',
    '14:15',
    '14:30',
    '14:45',
    '15:00',
    '15:15',
    '15:30',
    '14:45',
    '16:00',
    '16:15',
    '16:30',
    '16:45',
    '17:00',
    '17:15',
    '17:30',
    '17:45',
    '18:00',
    '18:15',
    '18:30',
    '18:45',
    '19:00',
    '19:15',
    '19:30',
    '19:45',
    '20:00',
    '20:15',
    '20:30',
    '20:45',
    '21:00',
    '21:15',
    '21:30',
    '21:45',
    '22:00',
    '22:15',
    '22:30',
    '22:45',
    '23:00',
    '23:15',
    '23:30',
    '23:45',
  ];

  gettimeList:any=[]
  excludeDays :any= [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];


  events: CalendarEvent[] = [];
  eventInfo!: CalendarEvent;
  smallDevice!: Observable<BreakpointState>;
  mediumDevice!: Observable<BreakpointState>;
  timeZone :any= 'Europe/Paris';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    public datepipe: DatePipe,
    private messageService: MessageService,
    private calendarService: CalendarService,
    public matDialogRef: MatDialogRef<TaskInToEventComponent>,
    private translate: TranslateService,
    private userService: ManageUsersService,
    private formBuilder: FormBuilder,
  ) {
    this.timeZone = localStorage.getItem('timeZone');
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
    this.calendarView = CalendarView.Week;
    this.viewDate = new Date();

    this.form = this.formBuilder.group({
      StartDate: [this.currentdate, [Validators.required]],
      StartTime: [],
      EndDate: [, [Validators.required]],
      EndTime: [],
      isScheduled:[false],
      scheduledStartTime:[],
      scheduledEndTime:[],
      excludeDays:[]
    })
  }

  ngOnInit() {
    console.log(this.data)
    localStorage.setItem("Screen", 'taskeventconvert');
    let startDateVal = new Date();
    this.startDate = startOfWeek(startDateVal);
    this.endDate = endOfWeek(startDateVal);
    this.startDate = this.datepipe.transform(this.startDate, 'yyyy-MM-dd');
    this.endDate = this.datepipe.transform(this.endDate, 'yyyy-MM-dd');
    this.checkavailabledate()
    this.smallDevice = this.breakpointObserver.observe('(max-width: 576px)');
    this.mediumDevice = this.breakpointObserver.observe('(max-width: 992px)');
    console.log(this.generateTimeStamps())
    this.gettimeList=this.generateTimeStamps()
  }

  getstartdatestatus(){
    if(this.datepipe.transform(new Date(), 'yyyy-MM-dd')==this.datepipe.transform(this.form.value.StartDate, 'yyyy-MM-dd')){
      return true
    }else{
      return false
    }
  }
  getScheduledstatus(){
    if(this.form.value.EndDate&&this.form.value.StartDate){
      if(this.datepipe.transform(this.form.value.StartDate, 'yyyy-MM-dd')==this.datepipe.transform(this.form.value.EndDate, 'yyyy-MM-dd')){
        return true
      }else{
        return false
      }
    }else{
      return true
    }
  }

  getisScheduledstatus(){
    return this.form.value.isScheduled
  }


  generateTimeStamps() {
    let currentDate = new Date(); // Get current date and time
    let timeList = []; // Initialize an empty array for time stamps
  
    // Set the current time to the nearest next 15-minute interval
    let startMinutes = Math.ceil(currentDate.getMinutes() / 15) * 15;
  
    // Loop to generate time stamps for the rest of the day
    for (let hours = currentDate.getHours(); hours < 24; hours++) {
      for (let minutes = (hours === currentDate.getHours() ? startMinutes : 0); minutes < 60; minutes += 15) {
        // Format hours and minutes as HH:mm
        let formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
        // Push the formatted time stamp into the array
        timeList.push(formattedTime);
      }
    }
  
    return timeList;
  }
  

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log(event, action);
  }


  calendarViewChanged(value: string) {
    let startDateVal = new Date(value);
    let startDate;
    let endDate;
    if (this.calendarView == 'month') {
      startDate = startOfMonth(startDateVal);
      endDate = endOfMonth(startDateVal);
      this.startDate = this.datepipe.transform(startDate, 'yyyy-MM-dd')
      this.endDate = this.datepipe.transform(endDate, 'yyyy-MM-dd')
      this.checkavailabledate()
    } else if (this.calendarView == 'week') {
      startDate = startOfWeek(startDateVal);
      endDate = endOfWeek(startDateVal);
      this.startDate = this.datepipe.transform(startDate, 'yyyy-MM-dd')
      this.endDate = this.datepipe.transform(endDate, 'yyyy-MM-dd')
      this.checkavailabledate()
    } else if (this.calendarView == 'day') {
      startDate = startOfDay(startDateVal);
      endDate = endOfDay(startDateVal);
      this.startDate = this.datepipe.transform(startDate, 'yyyy-MM-dd')
      this.endDate = this.datepipe.transform(endDate, 'yyyy-MM-dd')
      this.checkavailabledate()
    }
  }

  dayViewChanged(value: string) {
    console.log(this.viewDate)
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


  getavailableUsers() {
    this.calendarService.FindAvailableUsersofTask(this.data.data.id, this.startDate, this.endDate).subscribe(data => {
      console.log(data, 'data')
      if (data) {
        this.availableUsersList = data;
        this.showUsers = true;
        this.taskconvertObj = {
          "Taskid": this.data.data.id,
          "StartDate": this.startDate,
          "EndDate": this.endDate,
        }
      }
    });
  }


  showavailableUsers() {
    this.calendarService.FindAvailableUsersofTask(this.data.data.id, this.startDate, this.endDate).subscribe(data => {
      console.log(data, 'data')
      if (data) {
        this.availableUsersList = data;
        this.showUsers = true;
        this.taskconvertObj = {
          "Taskid": this.data.data.id,
          "StartDate": this.startDate,
          "EndDate": this.endDate,
        }
      }
    });
  }
  eventClicked(eve:any) {
    console.log('event' + JSON.stringify(eve), eve);
    if (eve?.title === 'Available users' || eve?.color?.primary === '#d1e8ff') {
      this.calendarService.FindAvailableUsersofTask(this.data.data.id, this.startDate, this.endDate).subscribe(data => {
        console.log(data, 'data')
        if (data) {
          this.availableUsersList = data;
          this.showUsers = true;
          this.taskconvertObj = {
            "Taskid": this.data.data.id,
            "StartDate": this.startDate,
            "EndDate": this.endDate,
          }
        }
      });
    } else if (eve?.color?.primary === '#32cd32') {
      this.showavailableUsers()
    }
    else {
      this.showUsers = false;
    }
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
      cell.events.forEach((event: any) => {
        groups[event.meta.type] = groups[event.meta.type] || [];
        groups[event.meta.type].push(event);
      });
      // cell['eventGroups'] = Object.entries(groups);
    });
  }

  closedialogbox() {
    this.matDialogRef.close(true)
  }
  closeshowUsers() {
    this.showUsers = false
  }



  gethursandminits(value:any){
    if(value==0){
      return '00'
    }else if(this.isTwoDigitNumber(value)==false){
      return '0'+value
    }
    else{
      return value.toString()
    }
  } 
  
  isTwoDigitNumber(num:any) {
    return num.toString().length === 2;
}

getstartInEvent(event:any){
  console.log(event)
  setTimeout(() => {
    this.SetStartDateAndStartTime()
  }, 10);
}
onSelectionChange(){
  this.getstarttime()
}

  getstarttime() {
    console.log()
    setTimeout(() => {
      this.SetStartDateAndStartTime()
    }, 10);
  }

  SetStartDateAndStartTime(){
    if(this.form.value.StartTime&&this.form.value.StartDate){
      const startDate = this.datepipe.transform(this.form.value.StartDate, 'yyyy-MM-dd');
      const startTime = this.form.value.StartTime;
      const durationHours = Number(this.data.data.hours);
      const durationMinutes = Number(this.data.data.minutes);
      const endDateAndTime = this.calculateEndDate(startDate, startTime, durationHours, durationMinutes);
      const [enddate,endtime]:any = endDateAndTime.split('T');
      this.form.get('EndTime')?.setValue(endtime.toString())
      this.form.get('EndDate')?.setValue(this.datepipe.transform(enddate, 'yyyy-MM-dd'))
      this.startDate = this.datepipe.transform(this.form.value.StartDate, 'yyyy-MM-dd') + 'T' + this.form.value.StartTime
      this.endDate = this.datepipe.transform(this.form.value.EndDate, 'yyyy-MM-dd') + 'T' + endtime
      if (this.form.value.StartDate && this.form.value.StartTime && this.form.value.EndDate && this.form.value.EndTime) {
        console.log(this.form.value.isScheduled)
        if(this.form.value.isScheduled==false){
          const data={
            id:this.data?.data?.id,
            StartDate:this.datepipe.transform(this.form.value.StartDate, 'yyyy-MM-dd'),
            StartTime:this.form.value.StartTime+':00'
          }
          this.createblackbox(data)
        }else{
          const data={
            id:this.data?.data?.id,
            StartDate:this.datepipe.transform(this.form.value.StartDate, 'yyyy-MM-dd'),
            StartTime:this.form.value.StartTime+':00',
            isScheduled:this.form.value.isScheduled,
            scheduledStartTime:this.form.value.scheduledStartTime,
            scheduledEndTime:this.form.value.scheduledEndTime,
            excludeDays:this.form.value.excludeDays,
          }
          this.createblackbox(data)
        }
      }
      setTimeout(() => {
        this.checkavailableUsersandavailabledates()
      }, 10);
    }
  }

   calculateEndDate(startDateStr:any, startTimeStr:any, durationHours:any, durationMinutes:any) {
    // Step 1: Parse Start Date and Time
    const [year, month,  day]:any = startDateStr.split('-');
    const [hours, minutes] = startTimeStr.split(':');
    const startDate = new Date( Number('20'+year), month - 1, day, hours, minutes); // month - 1 because months are zero-indexed in JavaScript
    // Step 2: Calculate End Time
    const endDate = new Date(startDate.getTime());
    endDate.setHours(startDate.getHours() + durationHours);
    endDate.setMinutes(startDate.getMinutes() + durationMinutes);
    // Step 3: Format the Result (assuming you want a specific format)
    const endDay = endDate.getDate();
    const endMonth = endDate.getMonth() + 1; // +1 because getMonth() returns zero-indexed
    const endYear = endDate.getFullYear().toString().slice(-2); // get last two digits of the year
    const endHours = endDate.getHours().toString().padStart(2, '0'); // ensure two-digit format
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0'); // ensure two-digit format
    const endDateFormatted = `${'20'+endYear}-${endMonth}-${endDay}T${endHours}:${endMinutes}`;
    return endDateFormatted;
  }

  getThreeValuesAfterTime(inputTime:any) {
    const index = this.timeList.indexOf(inputTime);
    if (index !== -1 && index + 3 < this.timeList.length) {
      return this.timeList.slice(index + 1, index + 4);
    }
    return [];
  }
  clearblackbox() {
    this.blackbox = !this.blackbox
  }


  checkavailableUsersandavailabledates() {
    this.getUsersInEvent()
  }

  getUsersInEvent() {
    if (this.startDate && this.endDate) {
      this.hideButton = false;
      this.calendarService.FindAvailableUsersofTask(
        this.data.data.id,
        this.startDate,
        this.endDate
      ).subscribe(data => {
        if (data) {
          this.blackbox = true
          this.taskconvertObj = {
            "Taskid": this.data.data.id,
            "StartDate": this.startDate,
            "EndDate": this.endDate,
          }
        }
      });
      this.events.push({
        "start": new Date(this.startDate),
        "end": new Date(this.endDate),
        "title": "Available users",
        "id": this.data.data.id,
        "color": {
          "primary": '#BAB8B7',   // gray 
          "secondary": '#BAB8B7'
        },
        "cssClass": 'black-box',

        "actions": [
          {
            "label": '',
            'onClick': ({ event }: { event: any }): void => {
            }
          }
        ],
        "meta": {
          "type": "danger"
        }
      });
      this.refresh.next();
    }
  }



submit(){
  if (this.form.value.StartDate && this.form.value.StartTime && this.form.value.EndDate && this.form.value.EndTime) {
    console.log(this.form.value.isScheduled)
    if(this.form.value.isScheduled==false){
      const data={
        id:this.data?.data?.id,
        StartDate:this.datepipe.transform(this.form.value.StartDate, 'yyyy-MM-dd'),
        StartTime:this.form.value.StartTime+':00'
      }
      this.taskconvertevent(data)
    }else{
      const data={
        id:this.data?.data?.id,
        StartDate:this.datepipe.transform(this.form.value.StartDate, 'yyyy-MM-dd'),
        StartTime:this.form.value.StartTime+':00',
        isScheduled:this.form.value.isScheduled,
        scheduledStartTime:this.form.value.scheduledStartTime,
        scheduledEndTime:this.form.value.scheduledEndTime,
        excludeDays:this.form.value.excludeDays,
      }
      this.taskconvertevent(data)
    }
  }
}



  taskconvertevent(values:any) {
    const TaskInToMilestone = this.dialog.open(ConformationComponent, {
      width: '400px',
      autoFocus: false,
      data: { data: '', type: 'taskconvertevent' },
      disableClose: true
    });
    TaskInToMilestone.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.ConvertTasktoEvent(values).subscribe((res: any) => {
          if (res) {
            console.log(res)
            if(res?.statusCode==200){
              this.messageService.showMessage(' Event Created successfully.');
              this.matDialogRef.close(true)
            } else if (res?.response[0].code == '200') {
              this.messageService.showMessage(' Event Created successfully.');
              this.matDialogRef.close(true)
            } else if (res?.response[0].code == '400') {
              this.messageService.showMessage(res?.response[0].message);
            }
          }
        })
      }
    })
  }


  checkavailabledate() {
    this.calendarService.FindAvailableUnavailableDatesofTaskUsers(this.data.data.id, this.startDate, this.endDate).subscribe(data => {
      console.log(data, 'data')
      if (data.availableDates.length != 0 && data.availableDates != null) {
        this.blackbox = true
        data.availableDates.forEach((element:any) => {
          this.events.push({
            "start": new Date(element.startDate),
            "end": new Date(element.endDate),
            "title": "",
            // "title": "Available dates",
            "id": this.data.data.id,
            "color": {
              "primary": '#d1e8ff', // lightblue
              "secondary": '#d1e8ff'
            },
            "actions": [
              {
                "label": '',
                'onClick': ({ event }: { event: any }): void => {
                }
              }
            ],
            "meta": {
              "type": "danger"
            }
          });
        });
        if (data.unAvailableDates.length != 0 && data.unAvailableDates != null) {
          this.blackbox = true
          data.unAvailableDates.forEach((element:any) => {
            this.events.push({
              "start": new Date(element.startDate),
              "end": new Date(element.endDate),
              // "title": "UnAvailable dates",
              "title": "",
              "id": this.data.data.id,
              "color": {
                "primary": "#f04141",   //  red 
                "secondary": '#f04141'
              },
              "actions": [
                {
                  "label": '',
                  'onClick': ({ event }: { event: any }): void => {
                  }
                }
              ],
              "meta": {
                "type": "danger"
              }
            });
          })
        }
        this.refresh.next();
      }
    });
  }



  createblackbox(data:any) {
    this.calendarService.GetTaskUsersCalender(data).subscribe((result:any)=>{
      if(result){
        if(this.events.length!=0){
          this.events=this.events.filter((element:any) => {
            if(element.color.primary!='#32cd32'){
              return element
            }
          });
        }
        if(result){
          let [enddate,endtime]=result.endDateTime.split('T')
          this.form.get('EndTime')?.setValue(endtime.split(':')[0]+':'+endtime.split(':')[1])
          this.form.get('EndDate')?.setValue(this.datepipe.transform(enddate, 'yyyy-MM-dd'))
          // result.forEach(element => {
            this.events.push({
              "start": new Date(result.startDateTime),
              "end": new Date(result.endDateTime),
              "title": "",
              "id": this.data.data.id,
              "color": {
                "primary": "#32cd32",   //  blue
                "secondary": '#32cd32'
              },
              "actions": [
                {
                  "label": '?',
                  'onClick': ({ event }: { event: any }): void => {
                  }
                }
              ],
              "meta": {
                "type": "danger"
              }
            });
            this.refresh.next();
          // });
        }
      }
    })
  }

}



