import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
  ChangeDetectionStrategy,
  Inject,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { CreateEventComponent } from './create-event/create-event.component';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { Observable, Subject, of } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { Contact } from 'src/app/core/models/contact.model';
import { Site } from 'src/app/core/models/site.model';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { OpenDayEventsModalPage } from '../../core/components/open-day-events-modal/open-day-events-modal.page';
import { Subscription } from 'rxjs';
import {
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay,
  CalendarView,
  CalendarWeekViewAllDayEvent,
} from 'angular-calendar';
import { CalendarEvent, WeekDay } from '../../core/models/calendar-event.model';
import {
  addDays,
  addHours,
  endOfDay,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns';
import { elementAt, first, takeWhile } from 'rxjs/operators';
import { DataSharedService } from 'src/app/core/components/datashare.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';
import { MapService } from 'src/app/core/services/map.service';
import { FiltershareService } from 'src/app/core/components/filtershare.service';
import { DatePipe } from '@angular/common';
import { UserDetailsComponent } from '../management/manage-users/user-details/user-details.component';
import { ContactDetailsComponent } from '../management/manage-contacts/contact-details/contact-details.component';
import { SiteDetailsComponent } from '../management/manage-sites/site-details/site-details.component';
import { FileDownloadShareComponent } from '../files/components/file-download-share/file-download-share.component';
import { EventPopUpDialog } from 'src/app/core/components/event-lists/event-lists.component';
import { setMinutes, setHours } from 'date-fns';
import { CheckOrganationTypeService } from 'src/app/core/services/check-organation-type.service';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { ResizeService } from 'src/app/core/services/resize.service';
import { TranslateService } from '@ngx-translate/core';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { PlanningSynchronisationComponent } from './planning-synchronisation/planning-synchronisation.component';
import { SynchronizationDataComponent } from 'src/app/core/components/synchronization-data/synchronization-data.component';

export interface Film {
  title: string;
  startDate: any;
  endDate: any;
  id: any;
}

export interface DialogData {
  eventId: any;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {
  clickEventsubscription!: Subscription;
  userId:any;
  RemovePlanningFilterButton = false;
  calendarView: string = 'month'; 
  CalendarView = CalendarView;
  viewDate: Date;
  eventLists:any;
  startDate;
  endDate;
  ScreenType = '';
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  activeDayIsOpen = false;
  isCarte: boolean = false;
  smallDevice!: Observable<BreakpointState>;
  mediumDevice!: Observable<BreakpointState>;
  @Input() private valueChange!: EventEmitter<boolean>;
  selectedMgmt: any = '';
  filterDetails: string = '';
  isAlive: boolean = true;
  eventsubcription: any;
  deleteeventsubcription: any;
  createeventsubcription: any;
  monthstartDate: any;
  monthendDate: any;
  filteredDetails!: string;
  dayStartHour = 8;
  OtherpepleData: any;
  OtherpeplePlanning!: boolean;
  timeZone :any= 'Europe/Paris';
  DemoOrganationstatus: boolean = false;
  size: any;
  width!: number;
  isMobileView!: boolean;
  constructor(
    private dialog: MatDialog,
    public datepipe: DatePipe,
    private authservice: AuthService,
    private breakpointObserver: BreakpointObserver,
    private mapService: MapService,
    private calendarService: CalendarService,
    public matDialogRef: MatDialogRef<CalendarComponent>,
    private sharedService: DataSharedService,
    public fileshareservice: FiltershareService,
    public OrgSrvice: CheckOrganationTypeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private resizeService: ResizeService,
    private translate: TranslateService,
    private matoService: MatomoService
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
    if(localStorage.getItem('isTrailVersion')=='true'){
      this.popupforerrormessage('You are using trail account so you are able to create 10 events per user','Events')
  }

    if (this.OrgSrvice.checkOrganationType().DemoOrganation === 'true') {
      this.DemoOrganationstatus = true;
      console.log(this.OrgSrvice.checkOrganationType());
      const data :any= this.OrgSrvice.messagesandheader('planning');
      this.popupforerrormessage(data.message, data.header);
    } else {
      // this.matoService.trackPageView('Planning-page');
    }

    this.timeZone = localStorage.getItem('timeZone');
    this.calendarView = CalendarView.Month;
    this.viewDate = new Date();
    let startDateInitial = new Date(this.viewDate);
    this.startDate = startOfMonth(startDateInitial);
    this.endDate = endOfMonth(startDateInitial);
  }
  formatTime(date: Date): any {
    return this.datepipe.transform(date, 'HH:mm');
  }

  ngOnInit(): void {
    this.resizeService.size$.subscribe((user) => {
      this.size = user.size;
      if (this.size < 992) {
        this.isMobileView = true;
      } else {
        this.isMobileView = false;
      }
    });
    this.width = window.innerWidth;
    if (!this.size && this.width < 992) {
      this.isMobileView = true;
    } else if (!this.size && this.width > 992) {
      this.isMobileView = false;
    }

    console.log(this.data);
    localStorage.setItem('Screen', 'Calendar');
    this.userId = localStorage.getItem('id');
    this.smallDevice = this.breakpointObserver.observe('(max-width: 576px)');
    this.mediumDevice = this.breakpointObserver.observe('(max-width: 992px)');
    // -------------
    this.createeventsubcription = this.calendarService.eventDetailsob.subscribe(
      (data) => {
        const params = this.createparams(this.startDate, this.endDate);
        this.getEvents(params);
      }
    );
    this.fileshareservice.createeventref.subscribe((data) => {
      const params = this.createparams(this.startDate, this.endDate);
      this.getEvents(params);
    });
    // ------------
    this.deleteeventsubcription =
      this.calendarService.deleteDetailsob.subscribe((data) => {
        const params = this.createparams(this.startDate, this.endDate);
        this.getEvents(params);
      });
    if (this?.data?.screenType == 'otherUserPlanning') {
      this.OtherpeplePlanning = true;
      this.OtherpeplePlanning = true;
      this.OtherpepleData = this.data.data;
      this.ScreenType = this?.data?.screenType;
      const params = this.createparamsOtherpepole(
        this.data.data,
        this.startDate,
        this.endDate
      ); 
      this.filterDetails = params;
      this.showAlert(params);
    } else {
      this.OtherpeplePlanning = false;
      const params = this.createparams(this.startDate, this.endDate);
      this.getEvents(params);
      this.eventsubcription = this.fileshareservice.filterDetailsob
        .pipe(takeWhile(() => this.isAlive))
        .subscribe((data) => {
          this.filterDetails = data;
          this.showAlert(this.filterDetails);
        });
    }
  }

  eventtitle(value:any) {
    if (this.isMobileView == true) {
      return value.slice(0, 5);
    } else {
      return value;
    }
  }

  RemovePlanningFilter() {
    localStorage.setItem('otheruserplanning', 'false');
    this.filterDetails = '';
    this.matDialogRef.close(true);
    this.ngOnInit();
    window.location.reload();
  }

  showAlert(params:any) {
    let url = window.location.href;
    this.isCarte = url.includes('carte');
    this.selectedMgmt = sessionStorage.getItem('SelectedFilter');

    if (this.isCarte) {
      if (this.selectedMgmt == 'Users') {
        this.mapService.filterMap(params).subscribe((res) => {
          this.formatEvents(res);
        });
      }
      if (this.selectedMgmt == 'Contacts') {
        this.mapService.filterMap(params).subscribe((res) => {
          this.formatEvents(res);
        });
      }
      if (this.selectedMgmt == 'Sites') {
        this.mapService.filterMap(params).subscribe((res) => {
          this.formatEvents(res);
        });
      }
    } else {
      if (this.selectedMgmt == 'Events' || this.selectedMgmt == 'events') {
        this.calendarService.filterEvents(params).subscribe((res) => {
          this.formatEvents(res);
        });
      }
      if (this.selectedMgmt == 'Users') {
        this.calendarService.filterEvents(params).subscribe((res) => {
          this.formatEvents(res);
        }); 
      }
      if (this.selectedMgmt == 'Contacts') {
        this.calendarService.filterEvents(params).subscribe((res) => {
          console.log(res);
          this.formatEvents(res);
        });
      }
      if (this.selectedMgmt == 'Sites') {
        let params = sessionStorage.getItem('FilterURL');
        this.calendarService.filterEvents(params).subscribe((res) => {
          this.formatEvents(res);
        });
      }
    }
  } 

  calendarViewChanged(value: string) {
    let startDateVal = new Date(value);
    let startDate;
    let endDate;
    if (this.calendarView == 'month') {
      if (this.filterDetails) {
        startDate = startOfMonth(startDateVal);
        endDate = endOfMonth(startDateVal);
        const params = this.createparamsOtherpepole(
          this.OtherpepleData,
          startDate,
          endDate
        );
        this.showAlert(params);
      } else if (!this.filterDetails) {
        startDate = startOfMonth(startDateVal);
        endDate = endOfMonth(startDateVal);
        const params = this.createparams(startDate, endDate);
        this.getEvents(params);
      }
    } else if (this.calendarView == 'week') {
      if (this.filterDetails) {
        startDate = startOfWeek(startDateVal);
        endDate = endOfWeek(startDateVal);
        const params = this.createparamsOtherpepole(
          this.OtherpepleData,
          startDate,
          endDate
        );
        this.showAlert(params);
      } else if (!this.filterDetails) {
        startDate = startOfWeek(startDateVal);
        endDate = endOfWeek(startDateVal);
        const params = this.createparams(startDate, endDate);
        this.getEvents(params);
      }
    } else if (this.calendarView == 'day') {
      if (this.filterDetails) {
        startDate = startOfDay(startDateVal);
        endDate = endOfDay(startDateVal);
        const params = this.createparamsOtherpepole(
          this.OtherpepleData,
          startDate,
          endDate
        );
        this.showAlert(params);
      } else if (!this.filterDetails) {
        startDate = startOfDay(startDateVal);
        endDate = endOfDay(startDateVal);
        const params = this.createparams(startDate, endDate);
        this.getEvents(params);
      }
    }
  }

  formatEvents(res:any) {
    const result = res.sort((a:any, b:any) => {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
    this.events = [];
    this.eventLists = result;
    this.eventLists.map((element:any) => {
      console.log(element.startDate);
      element.startDate = new Date(
        element?.startDate.toLocaleString('en', { timeZone: this.timeZone })
      );
      element.endDate = new Date(
        element?.endDate.toLocaleString('en', { timeZone: this.timeZone })
      );
      console.log(element.startDate);
    });
    this.eventLists.forEach((element:any) => {
      console.log(element.startDate);
      const time :any= this.datepipe.transform(element.startDate, 'HH');
      if (this.dayStartHour < parseInt(time)) {
        this.dayStartHour = parseInt(time);
      }
      let eventCreator;
      if (element.eventCreatorId == this.userId) {
        eventCreator = true;
      } else {
        eventCreator = false;
      }
      this.events.push({
        start: new Date(element.startDate),
        end: new Date(element.endDate),
        title: element.title,
        address: element.address,
        city: element.city,
        country: element.country,
        id: element.id,
        categorycolor: element.color,
        timeFormat: 'HH:mm',
        color: {
          primary: element.fontColor,
          secondary: element.color,
        },
        textColor: element.fontColor,
        isEventCreator: eventCreator,
        isExternalEvent: element.isExternalEvent,
        source: element.source,
        isPublic: element.isPublic,
        hasFile: element.hasFile,
        hasNote: element.hasNote,
        isConvertedFromTask:element.isConvertedFromTask,
        isOnlineEvent: element.isOnlineEvent,
        myValidationStatus: element.myValidationStatus,
        isInvitedUserEvent: element.isInvitedUserEvent,
        isSimulation: element.isSimulation,
        isProposalEvent: element.isProposalEvent,
        meta: {
          type: 'danger',
        },
      });
    });
    this.refresh.next();
  }

  getEvents(params:any) {
    console.log(params);
    this.calendarService.filterEvents(params).subscribe((res: any) => {
      if (res) {
        this.formatEvents(res);
      }
    });
    this.refresh.next();
  }

  // createparams
  createparams(start:any, End:any) {
    const params =
      'startDate=' +
      this.datepipe.transform(start, 'yyyy/MM/dd') +
      '&endDate=' +
      this.datepipe.transform(End, 'yyyy/MM/dd');
    return params;
  }
  // createparams in otherpepole
  createparamsOtherpepole(data:any, startDate:any, endDate:any) {
    if (data?.IsPublic) {
      let params =
        'IsPublic=' +
        data.IsPublic +
        '&AdvancedSearch=' +
        'Users' +
        '&startDate=' +
        this.datepipe.transform(startDate, 'yyyy/MM/dd') +
        '&endDate=' +
        this.datepipe.transform(endDate, 'yyyy/MM/dd') +
        '&OtherUserId=' +
        data.User.id +
        '&OtherEvents=' +
        true;
      return params;
    } else {
      let params =
        'startDate=' +
        this.datepipe.transform(startDate, 'yyyy/MM/dd') +
        '&endDate=' +
        this.datepipe.transform(endDate, 'yyyy/MM/dd');
      return params;
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
        console.log(events);
        this.activeDayIsOpen = true;
        const openDayEventsDialog = this.dialog.open(OpenDayEventsModalPage, {
          width: '500px',
        });

        openDayEventsDialog.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
      }
    }
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    console.log(body);
    body.forEach((cell) => {
      const groups: any = {};
      cell.events.forEach((event:any) => {
        groups[event.meta.type] = groups[event.meta.type] || [];
        groups[event.meta.type].push(event);
      });
      // cell['eventGroups'] = Object.entries(groups);
    });
  }

  openAddEventDialog() {
    const openAddEventDialog = this.dialog.open(CreateEventComponent, {
      width: '500px',
      autoFocus: false,
      data: { screenType: 'CreateEvent' },
      disableClose: true,
      panelClass: 'custom-dialog-container',
    });

    openAddEventDialog.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  openEvents(event: any) {
    const dialogRef = this.dialog.open(EventPopUpDialog, {
      width: '550px',
      autoFocus: false,
      disableClose: true,
      data: {
        eventId: event['id'],
        dataevent: event,
        screentype: this?.data?.screenType ? this?.data?.screenType : null,
      },
    });
  }

  eventClicked(event: any) {
    const dialogRef = this.dialog.open(EventPopUpDialog, {
      width: '550px',
      autoFocus: false,
      disableClose: true,
      data: {
        eventId: event['id'],
        dataevent: event,
        screentype: this?.data?.screenType ? this?.data?.screenType : null,
      },
    });
  }

  ngOnDestroy() {
    // this.isAlive = false;
    this.eventsubcription.unsubscribe();
    this.deleteeventsubcription.unsubscribe();
  }

  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '550px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }


  
  SynchronizationData(){
    this.dialog.open(SynchronizationDataComponent, {
      width: '100%',
      data: { ScreenType:'PlanningPage'},
      autoFocus: false,
      disableClose: true,
    });
  }
}

// ----------------------0000000000000000

@Component({
  selector: 'calendar-popup-dialog',
  templateUrl: 'calendar-popup-dialog.html',
  styleUrls: ['./calendar-popup-dialog.scss'],
})
export class CalendarPopUpDialog implements OnInit {
  showUser = false;
  showcontact = false;
  showfile = false;
  shownotes = false;

  userDeatils: any;
  contactDeatils: any;
  filesDeatils: any;
  notesDeatils: any;
  eventLinkedById: any;
  eventData:any;
  eventUsers:any;
  clients:any;
  eventUsersDto:any;
  eventContactsDtos:any;
  getfile: any;
  getNotes: any;

  constructor(
    public dialogRef: MatDialogRef<CalendarPopUpDialog>,
    private calendarService: CalendarService,
    public dialog: MatDialog,
    private manageUsersService: ManageUsersService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    console.log(this.data.eventId);
    this.calendarService.FindEventById(this.data.eventId).subscribe((res) => {
      this.eventData = res;
      console.log(this.eventData, 'check');
      this.eventUsers = res.eventUsers;
      this.clients = res.eventContacts;
      this.eventUsersDto = res.eventUsersDto;
      this.eventContactsDtos = res.eventContactsDtos;
    });
  }

  findUsersLinked() {
    this.calendarService
      .FindUsersByEventId(this.data.eventId)
      .subscribe((res) => {
        if (res) {
          this.userDeatils = res;
          this.showUser = true;
        }
      });
  }
  findcontactLinked() {
    this.calendarService.FindEventLinked(this.data.eventId).subscribe((res) => {
      if (res) {
        this.contactDeatils = res.groupOfContactsDtos;
        this.showcontact = true;
      }
    });
  }
  findfilesLinked() {
    this.calendarService
      .getFilesForEvent(this.eventData.id, 'Events')
      .subscribe((res) => {
        if (res) {
          this.getfile = res;
          console.log(this.getfile);
          this.showfile = true;
        }
      });
  }
  findNotesLinked() {
    this.calendarService
      .getNotesForEvent(this.eventData.id, 'Events')
      .subscribe((res) => {
        if (res) {
          this.getNotes = res;
          console.log(this.getNotes);
          this.shownotes = true;
        }
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openUserDialog(id: number, details:any, type: string): void {
    console.log(details, type);
    const dialogRef = this.dialog.open(UserDetailsComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: {
        id: id,
        row: details,
        type: type,
      },
      position: { top: '125px', left: '700px' },
    });
  }

  openContactDialog(id: number, row:any, type: string): void {
    console.log(id);
    this.dialog.open(ContactDetailsComponent, {
      disableClose: true,
      data: {
        id: id,
        row: row,
        type: type,
      },
      position: { top: '125px', left: '700px' },
      width: '500px',
    });
  }

  openSiteDialog(id: number, type: string): void {
    // console.log(id);
    this.dialog.open(SiteDetailsComponent, {
      disableClose: true,
      data: {
        id: id,
        type: type,
      },
      position: { top: '125px', left: '700px' },
      width: '500px',
    });
  }

  // gotofiles
  gotofiles(row:any) {
    this.dialog.open(FileDownloadShareComponent, {
      width: '500px',
      data: row,
      position: { top: '125px', left: '700px' },
      autoFocus: false,
      disableClose: true,
    });
  }

}
