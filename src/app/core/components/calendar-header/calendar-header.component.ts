import { BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { MatDialog } from '@angular/material/dialog';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { endOfMonth, startOfMonth } from 'date-fns';
import { DatePipe } from '@angular/common'
import { FiltershareService } from '../filtershare.service';
import { TranslateService } from '@ngx-translate/core';
import { MapfilterService } from '../mapfilter.service';
// import { ProspectconfigurationComponent } from '../prospectconfiguration/prospectconfiguration.component';
@Component({
  selector: 'pm-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss'],
})
export class CalendarHeaderComponent implements OnInit {
  isSmallDevice!: Observable<BreakpointState>;
  CalendarView = CalendarView;
  appliedFilter: any;
  filterBoolean: boolean = false;
  isCarte: boolean = false;
  screen:boolean= true;
  @Input() view!: string;

  @Input() OtherpeplePlanningStatus!: boolean;
  @Input() OtherpeplemapStatus!: boolean;


  @Input()
  viewDate!: Date;

  @Input()
  locale = 'en';

  @Input()
  smallDevice!: Observable<BreakpointState>;

  @Output()
  viewChange: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  viewDateChange: EventEmitter<Date> = new EventEmitter<Date>();

  // Emit the value to user parent method
  @Output()
  calendarViewChanged: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  dayViewChanged: EventEmitter<string> = new EventEmitter<string>();
  datevalue!: string;

  @Output()
  calendarViewChanged1: EventEmitter<string> = new EventEmitter<any>();

  @Output()
  calendarViewChanged2: EventEmitter<string> = new EventEmitter<any>();

  // @Input() firstdayformats = new EventEmitter<any>();

  firstdayformat!: any;
  lastdayformat!: any;


  eventsubcriptions: any;
  filterDetails: any;
  configuresubscription: any;
  alldata: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    public datepipe: DatePipe,
    public fileshareservice: FiltershareService,
    public MapfilterService: MapfilterService,
    private translate: TranslateService ,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }    
    this.eventsubcriptions = this.fileshareservice.filterDetailsob.subscribe((data:any) => {
      this.filterDetails = data;
    })

    this.configuresubscription = this.MapfilterService.mapconfiguredetails.subscribe((data:any) => {
      this.alldata = data
    })
  }

  ngOnInit() {
    if(localStorage.getItem('Screen')=='EventProposal'||localStorage.getItem('Screen')=='taskeventconvert'){
      this.screen=false
    }else{
      this.screen=true
    }
    this.appliedFilter = sessionStorage.getItem("FilterValue");
    let url = window.location.href;
    this.isCarte = url.includes('carte');
    if (this.appliedFilter) {
      this.filterBoolean = true;
    } else {
      this.filterBoolean = false;
    }
    this.isSmallDevice = this.breakpointObserver.observe('(max-width: 1075px)');
    let todayDate = new Date(this.viewDate);
    console.log(todayDate, 'todayDate')
    let firstDay = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
    let lastDay = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0);
    this.firstdayformat = this.datepipe.transform(firstDay, 'yyyy-MM-dd');
    this.lastdayformat = this.datepipe.transform(lastDay, 'yyyy-MM-dd');
    console.log(this.firstdayformat, this.lastdayformat);
  }

  removeFilter() {
    sessionStorage.removeItem("FilterValue");
    let filterType = sessionStorage.getItem('FilterType')
    this.eventsubcriptions.unsubscribe();
    // if (this.isCarte == true) {
    //   this.calendarViewChanged2.emit(this.viewDate.toDateString());
    // } else {
    //   this.calendarViewChanged.emit(this.viewDate.toDateString());
    // }
    this.calendarViewChanged.emit(this.viewDate.toDateString());
  }


  calViewChanged(calView: string) {
    console.log(calView, 'calview')
    this.datevalue = calView; 
    this.viewChange.emit(calView); 
    this.calendarViewChanged.emit(this.viewDate.toDateString());
  }


  checkFilter() {
    this.appliedFilter = sessionStorage.getItem("FilterValue");
    let filterType = sessionStorage.getItem('FilterType')
    if (this.isCarte) {
      if (filterType == 'map') {
        if (this.appliedFilter) {
          return true;
        } else {
          return false;
        }
      } else if (filterType == 'event') {
        return false;
      } else {
        return false
      }
    } else {
      if (filterType == 'map') {
        return false;
      } else if (filterType == 'event') {
        if (this.appliedFilter) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }


  calDayChanged(viewDate:any) {
    this.viewDateChange.next(viewDate);
    this.calendarViewChanged.emit(this.viewDate.toDateString());
    let todayDate = new Date(this.viewDate);
    console.log(todayDate, 'present Date on cal')
    let firstDay = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
    let lastDay = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0);
    this.firstdayformat = this.datepipe.transform(firstDay, 'yyyy-MM-dd');
    this.lastdayformat = this.datepipe.transform(lastDay, 'yyyy-MM-dd');
  }

  calendarFilter() {

  }




  closeDialog() {
    this.dialog.closeAll();
  }

  ngOnDestroy() {
    this.configuresubscription.unsubscribe();
  }


}
