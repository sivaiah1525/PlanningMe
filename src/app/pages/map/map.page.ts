import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, Output, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input, OnChanges, OnDestroy, SimpleChanges, EventEmitter, ElementRef, SimpleChange, } from '@angular/core';
import { OpenDayEventsModalPageModule } from '../../core/components/open-day-events-modal/open-day-events-modal.module';
//import { ModalController } from '@ionic/angular';
//import { ModalOptions } from '@ionic/core';
import { CalendarEvent, WeekDay } from '../../core/models/calendar-event.model';
import { CalendarView } from 'angular-calendar';
import { CreateEventComponent } from '../../pages/calendar/create-event/create-event.component';
//import { addDays, addHours, endOfMonth, startOfDay, subDays } from 'date-fns';
import { Observable, Subject, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapService } from '../../core/services/map.service';
// import * as _ from 'lodash';
import { Title } from '@angular/platform-browser';
import { Location, Appearance, GermanAddress } from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { addDays, addHours, endOfDay, endOfMonth, endOfWeek, isSameDay, isSameMonth, startOfDay, startOfMonth, startOfWeek, subDays } from 'date-fns';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { DialogData } from '../calendar/calendar.component';
import { DataSharedService } from 'src/app/core/components/datashare.service';
import { DatePipe } from '@angular/common';
import { ContactDetailsComponent } from '../management/manage-contacts/contact-details/contact-details.component';
import { UserDetailsComponent } from '../management/manage-users/user-details/user-details.component';
import { SiteDetailsComponent } from '../management/manage-sites/site-details/site-details.component';
import { EventPopUpDialog } from 'src/app/core/components/event-lists/event-lists.component';
import { EditProposalComponent } from 'src/app/core/components/event-lists/edit-proposal/edit-proposal.component';
import { EditEventComponent } from 'src/app/core/components/event-lists/edit-event/edit-event.component';
import { EventProposalComponent } from 'src/app/core/components/event-lists/event-proposal-calender/event.proposal.component';
import { MessageService } from 'src/app/core/services/message.service';
import { redo } from '@syncfusion/ej2-angular-richtexteditor';
import { AgmMarkerCluster, ClusterManager } from '@agm/js-marker-clusterer';
import { AgmMap, InfoWindowManager, MarkerManager } from '@agm/core';
import { elementAt } from 'rxjs/operators';
import { MatSnackBar, _SnackBarContainer } from '@angular/material/snack-bar';
import { MappingconfigurationformComponent } from '../settings/mappingconfigurationform/mappingconfigurationform.component';
import { param } from 'jquery';
import { CheckOrganationTypeService } from 'src/app/core/services/check-organation-type.service';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { ClusterTableComponent } from './cluster-table/cluster-table.component';
import { ProspectsearchService } from 'src/app/core/services/prospectsearch.service';
import { MapfilterService } from 'src/app/core/components/mapfilter.service';


declare let google: any;
class Events {
  id!: string;
  lat!: number;
  lng!: number;
  label?: string;
  draggable?: boolean;
  start?: Date | string;
  end?: Date | string;
  title?: string;
  code: any;
  type?: string;
  single?: boolean;
  color?: string;
  allDay?: boolean;
  IsMasked?: boolean;
  address?: string;
  profilePicture?: string;
  city?: string;
  country?: string;
  zipcode?: string;
  resizable?: {};
  meta?: {};
  isConsumedData?: boolean;
  email?: any;
  phoneNumber?: any;
  position?: any;
  codenaf?: any;
  companyName?: any
  registrationNumber?: any
  ActivityName?: any
}


@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ClusterManager, { provide: MarkerManager, useExisting: ClusterManager }, InfoWindowManager,]
})
export class MapPageComponent implements OnInit {
  @ViewChild(AgmMarkerCluster) markerCluster!: AgmMarkerCluster;
  clickedClusterCount!: number;
  map!: AgmMap;
  // markerCluster: any;
  clusterManager!: ClusterManager;
  public appearance = Appearance;
  public zoom: number = 8;
  public latitude!: number;
  public longitude!: number;
  public selectedAddress!: PlaceResult;
  calendarView: string;
  CalendarView = CalendarView;
  ImportExternalData = false;
  OnssenDataResponse: any;
  viewDate: Date;
  startDateVal: Date = new Date();
  endDateVal: Date = new Date();
  clickEventsubscription!: Subscription;
  lat: number = 48.8669571;
  lng: number = 2.3373176;
  selectedMgmt: any = '';
  // viewDate: Date;
  smallDevice!: Observable<BreakpointState>;
  mediumDevice!: Observable<BreakpointState>;
  showFilter = true;
  isCarte: boolean = false;
  @ViewChild("placesRef") placesRef!: GooglePlaceDirective;
  filterDetails: any;
  mapeventsubcription: any;
  monthstartDate: any;
  monthendDate: any;
  id!: number;
  type: any;
  userid!: string;
  siteid: any;
  contactid!: number;
  markerEvents!: Events[];
  showremove!: boolean;
  index: any;
  onseenDataLimit: any
  grpbylocation!: Events[];
  listgrplocation: any;
  showtitle!: Events[];
  basegrplocation!: Events[];
  dialogshow: boolean = false;
  onseendata: any;
  configuresubscription: any;
  isPlanningData!: boolean;
  @Input() imagePath!: string;
  Height: Window["innerHeight"];
  flag = false;
  formdata: any;
  datatype: any;
  onssendataId: any;
  numberofrecord: any;
  availableCredits: any
  ScreenType = ''
  OtherpepleData: any;
  onseendatastatus = false
  Otherpeplemap!: boolean
  DemoOrganationstatus:boolean=false
  MapClickcoords:any
  private _observableSubscriptions: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private mapService: MapService,
    private titleService: Title,
    private sharedService: DataSharedService,
    private prospectService: ProspectsearchService,
    private snackBar: MatSnackBar,
    private calendarService: CalendarService,
    public MapfilterService: MapfilterService,
    public datepipe: DatePipe,
    private messageService: MessageService,
    private _clusterManager: ClusterManager,
    public matDialogRef: MatDialogRef<MapPageComponent>,
    public OrgSrvice:CheckOrganationTypeService,
    private matoService: MatomoService,
  ){
    this.matoService.trackPageView('Map-page');
        if (this.OrgSrvice.checkOrganationType().DemoOrganation === 'true') {
      this.DemoOrganationstatus=true
      console.log(this.OrgSrvice.checkOrganationType());
      const data:any=this.OrgSrvice.messagesandheader('Map')
      console.log(data)
      this.popupforerrormessage(data.message, data.header);
    } 
    
    this.Height = window.innerHeight - 150
    this.calendarView = CalendarView.Month;
    this.viewDate = new Date();
    let startDateInitial = new Date(this.viewDate);
    this.startDateVal = startOfMonth(startDateInitial);
    this.endDateVal = endOfMonth(startDateInitial);

    // 00000000000000 
    this.MapfilterService.mapfilterDetailsob.subscribe((data) => {
      if (data) {
        this.filterDetails = data;
        this.showAlert(this.filterDetails);
      }
    });
    // 111111111111 
    this.MapfilterService.mapconfiguredetails.subscribe((data) => {
      if (data == 1) {
        this.configureData(data, this.startDateVal, this.endDateVal);
      } else if (data == 2) {
        this.onseendatastatus = true
        this.configureData(data, this.startDateVal, this.endDateVal);
        // this.showOnSeenData();
      } else if (data == 3) {
        this.showOnSeenData();
      }
    });
    // 222222222222 
    this.MapfilterService.prospectConfigurtion.subscribe((data) => {
      console.log(data)
      if (data) {
        this.ImportExternalData = true
        this.mapService.ConvertOnssenDataToPlanningAndMeData(data.displayResult).subscribe((result: any) => {
          this.mapdataformat(result)
          this.OnssenDataResponse = result
        })
      }
    });
    // 3333333333 
    this.MapfilterService.getProspectConfigurationData.subscribe((data) => {
      if (data) {
        this.formdata = data
      }
    })
    // 44444444444444 
    this.MapfilterService.checklimitdata.subscribe((data) => {
      if (data) {
        this.onseenDataLimit = data.creditCount
        this.numberofrecord = data.noOfRecords
        this.availableCredits = data.availableCredits
      }
    })
  }



  ngOnInit() {
    this.smallDevice = this.breakpointObserver.observe('(max-width: 576px)');
    this.mediumDevice = this.breakpointObserver.observe('(max-width: 992px)');
    if (this.data?.screenType == 'otherUserMap') {
      this.Otherpeplemap = true
      this.ScreenType = this?.data?.screenType
      this.OtherpepleData = this.data.data;
      this.Height = 550
      this.filterDetails = this.data.data
      const params = this.createparamsOtherUser(this.filterDetails, this.startDateVal, this.endDateVal)
      this.showAlert(params)
    } else {
      this.Otherpeplemap = false
      const params = this.createparamsmap(this.startDateVal, this.endDateVal)
      this.getMapData(params);
    }
  }





  RemovePlanningFilter() {
    this.filterDetails = ''
    this.matDialogRef.close(true)
    this.ngOnInit()
    window.location.reload()

  }


  checkvalue(v:any) {
    if (v == 1) {
      this.flag = false
    } else {
      this.flag = true
    }
  }
  ImportOnssenData(ImportOnssenDataResponse: TemplateRef<any>) {
    this.datatype = 'multidata'
    this.dialog.open(ImportOnssenDataResponse)

  }

  importOnssenData(value:any) {
    if (value == 'singledata') {
      this.prospectService.getonssendatabyId(this.onssendataId).subscribe((res: any) => {
        if (res) {
          this.mapService.ConvertOnssenDataToPlanningAndMeData(res.displayResult).subscribe((res) => {
            if (res) {
              this.mapService.ImportOnssendataResponse(res).subscribe((res) => {
                if (res) {
                  this.snackBar.open(res[0], '', { duration: 2000, });
                  this.dialog.closeAll()

                }
              })
            }
          })
        }
      })
    } else {
      this.prospectService.getorginalDtataWithApiKey(this.formdata).subscribe((result: any) => {
        if (result) {
          this.mapService.ConvertOnssenDataToPlanningAndMeData(result.displayResult).subscribe((result) => {
            if (result) {
              this.mapService.ImportOnssendataResponse(result).subscribe((res) => {
                if (res) {
                  this.snackBar.open(res[0], '', { duration: 2000, });
                  console.log(res)
                  this.dialog.closeAll()

                }
              })
            }
          })
        }
      })
    }


  }

  ImportOssendata(ImportOnssenDataResponse: TemplateRef<any>, e:any) {
    this.onssendataId = e.id
    this.datatype = 'singledata'
    this.dialog.open(ImportOnssenDataResponse)
  }

  mapdataformat(data:any) {
    this.markerEvents = []
    data.forEach((elament:any) => {
      this.markerEvents.push({
        lat: elament?.latitude,
        lng: elament?.longitude,
        id: elament?.id,
        title: elament?.title,
        profilePicture: elament?.profilePicture,
        start: elament?.startDate,
        end: elament?.endDate,
        address: elament?.address,
        zipcode: elament?.zipcode,
        IsMasked: elament?.isMasked,
        code: elament?.code,
        city: elament?.city,
        country: elament?.country,
        type: elament?.type,
        ActivityName: elament?.ActivityName,
        isConsumedData: elament?.isConsumedData,
        companyName: elament?.companyName,
        email: elament?.email,
        phoneNumber: elament?.phoneNumber,
        position: elament?.position,
        registrationNumber: elament?.registrationNumber,
        codenaf: elament?.codeNAF
      })
    })
    console.log(this.markerEvents)
  }



  showOnSeenData() {
    console.log('log-2')
    // this.mapService.onseenMapping('').subscribe((res) => {
    //   this.type = 'onSeenData';
    //   let sortedData = _.sortBy(res, ['title']);
    //   this.mapdataformat(sortedData)
    // });
  }

  contactpopup(event:any) {
    let dialogRef = this.dialog.open(ContactDetailsComponent, {
      data: { data: event, type: 'contact' }, width: '500px'
    });
  }

  openUserDialog(event:any) {

    this.dialog.open(UserDetailsComponent, {
      data: { data: event, type: 'user' }, width: '500px'
    });
  }

  openSiteDialog(event:any) {
    this.dialog.open(SiteDetailsComponent, {
      data: { data: event, type: 'site' }, width: '500px'

    });
  }


  dayViewChanged(value: string) {
    console.log(value);
    let startDateVal = new Date(value);
    let startDate;
    let endDate;
    if (this.calendarView == 'month') {
      this.startDateVal = startOfMonth(startDateVal);
      this.endDateVal = endOfMonth(startDateVal);
      const params = this.createparamsmap(this.startDateVal, this.endDateVal)
      this.getMapData(params);
    } else if (this.calendarView == 'week') {
      this.startDateVal = startOfWeek(startDateVal, { weekStartsOn: 0 });
      this.endDateVal = endOfWeek(startDateVal);
      const params = this.createparamsmap(this.startDateVal, this.endDateVal)
      this.getMapData(params);
    } else {
      this.startDateVal = startDateVal;
      this.endDateVal = startDateVal;
      const params = this.createparamsmap(this.startDateVal, this.endDateVal)
      this.getMapData(params);
    }


  }
  setLocation(eve:any) {
    this.lat = eve.lat;
    this.lng = eve.lng;
  }


  onLocationSelected(location: Location) {
    this.lat = location.latitude;
    this.lng = location.longitude;
    const params = this.createparamsmap(this.startDateVal, this.endDateVal)
    this.getMapData(params);
  }
  onClick(eve:any) {
    let startdate: any = this.startDateVal;
    let enddate: any = this.endDateVal;
    let sessObj = {
      id: eve.id,
      type: (eve.type).slice(0, -1),
      startDate: startdate,
      endDate: enddate
    };
    sessionStorage.setItem('mapEvents', JSON.stringify(sessObj));
    const dialogRef = this.dialog.open(EventListPopUpDialog, { width: '500px', data: { eventId: eve } });

  }

  showAlert(filterDetails:any) {
    let url = window.location.href;
    this.isCarte = url.includes('carte');
    this.selectedMgmt = sessionStorage.getItem('SelectedFilter');

    if (this.isCarte) {
      if (this.selectedMgmt == 'Users') {
        this.mapService.filterMap(filterDetails).subscribe((res: any) => {
          console.log(res)
          if (res?.defaultMapDtos) {
            this.mapdataformat(res.defaultMapDtos);

          } else {
            this.mapdataformat(res);
          }
        });
      }
      if (this.selectedMgmt == 'Contacts') {
        this.mapService.filterMap(filterDetails).subscribe((res: any) => {
          console.log(res)
          if (res?.defaultMapDtos) {
            this.mapdataformat(res.defaultMapDtos);

          } else {
            this.mapdataformat(res);
          }
        });
      }
      if (this.selectedMgmt == 'Sites') {
        this.mapService.filterMap(filterDetails).subscribe((res: any) => {
          console.log(res)
          if (res?.defaultMapDtos) {
            this.mapdataformat(res.defaultMapDtos);

          } else {
            this.mapdataformat(res);
          }
        });
      }
    }
  }



  groupBy(array:any, f:any) {
    var groups:any= {};
    array.forEach(function (o:any) {

      var group:any = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group:any) {
      return groups[group];
    });
  }

  getMapData(params:any) {
    this.mapService.filterMap(params).subscribe((res) => {
      if (res) {
        this.mapdataformat(res)
      }
    })

  }



  FilterRemove() {
    window.location.reload()
    this.ngOnInit()
    this.ImportExternalData = false
  }
  showPic(eve:any) {
    if (eve.type == "Users" || eve.type == "Contacts") {
      return true;
    } else {
      return false;
    }
  }
  //  icon url in map 
  iconURL(eve:any) {
    let value=''
    if (eve.type == "Users" && eve.isConsumedData == false) {
      value= "assets/images/iconsForsvg/icon_red.svg";
    }
    else if (eve.type == "Contacts" && eve.isConsumedData == false) {
      value= "assets/images/iconsForsvg/icon_blue.svg";
    }
    else if (eve.type == "Sites" && eve.isConsumedData == false) {
      value= "assets/images/iconsForsvg/icon_green.svg";
    }
    else if (eve.type == "Users" && eve.single == true) {
      value= "assets/images/iconsForsvg/icon_red.svg";
    }
    else if (eve.type == "Contacts" && eve.single == true) {
      value= "assets/images/iconsForsvg/icon_blue.svg";
    }
    else if (eve.type == "Sites" && eve.single == true) {
      value= "assets/images/iconsForsvg/icon_green.svg";
    }
    else if (eve.length > 1) {
      value= "assets/images/iconsForsvg/icon_black.svg";
    }
    else if (eve.isConsumedData == true && eve.IsMasked == false) {
      value= "assets/images/iconsForsvg/icon_pink.svg";
    }
    else if (eve.isConsumedData == true && eve.IsMasked == true) {
      value= "assets/images/iconsForsvg/icon_purple.svg";
    }
    else if (eve.isConsumedData == true && eve.IsMasked == false && eve.single == true) {
      value= "assets/images/iconsForsvg/icon_pink.svg";
    }
    else if (eve.isConsumedData == true && eve.IsMasked == true && eve.single == true) {
      value= "assets/images/iconsForsvg/icon_purple.svg";
    }
    return value

  }


  createparamsmap(startdate:any, enddate:any) {
    const params = 'startDate=' + this.datepipe.transform(startdate, 'yyyy-MM-dd') + '&endDate=' + this.datepipe.transform(enddate, 'yyyy-MM-dd') + '&InitialLoad=' + true
    return params
  }


  createparamsOtherUser(data:any, startDate:any, endDate:any) {
    if (data?.User?.id) {
      const params = 'OtherUserId=' + data.User.id + '&AdvancedSearch=' + 'Users' + '&othersMap=' + true + '&InitialLoad=' + false
        + '&startDate=' + this.datepipe.transform(startDate, 'yyyy-MM-dd') + '&endDate=' + this.datepipe.transform(endDate, 'yyyy-MM-dd')
      return params
    } else {
      const params = 'startDate=' + this.datepipe.transform(startDate, 'yyyy-MM-dd') + '&endDate=' + this.datepipe.transform(endDate, 'yyyy-MM-dd') + '&InitialLoad=' + true
      return params
    }

  }

  calendarViewChanged(value: string): void {
    console.log('log-2')
    let startDateVal = new Date(value);
    let startDate;
    let endDate;
    if (this.calendarView == 'month') {
      if (this.filterDetails) {
        startDate = startOfMonth(startDateVal);
        endDate = endOfMonth(startDateVal);
        const params = this.createparamsOtherUser(this.filterDetails, startDate, endDate)
        this.showAlert(params);
      }
      else if (!this.filterDetails) {
        startDate = startOfMonth(startDateVal);
        endDate = endOfMonth(startDateVal);
        const params = this.createparamsmap(startDate, endDate)
        this.getMapData(params);
      }
    } else if (this.calendarView == 'week') {
      if (this.filterDetails) {
        startDate = startOfWeek(startDateVal);
        endDate = endOfWeek(startDateVal);
        const params = this.createparamsOtherUser(this.filterDetails, startDate, endDate)
        this.showAlert(params);
      }
      else if (!this.filterDetails) {
        startDate = startOfWeek(startDateVal);
        endDate = endOfWeek(startDateVal);
        const params = this.createparamsmap(startDate, endDate)
        this.getMapData(params);
      }
    } else if (this.calendarView == 'day') {
      if (this.filterDetails) {
        startDate = startOfDay(startDateVal);
        endDate = endOfDay(startDateVal);
        const params = this.createparamsOtherUser(this.filterDetails, startDate, endDate)
        this.showAlert(params);
      }
      else if (!this.filterDetails) {
        startDate = startOfDay(startDateVal);
        endDate = endOfDay(startDateVal);
        const params = this.createparamsmap(startDate, endDate)
        this.getMapData(params);
      }
    }
  }

 




  // ---------- 
  onMapClick(event:any){
    this. MapClickcoords={
      lat:event.coords.lat,
      lng:event.coords.lng,
    }
  }
  onZoomChange(event:any){
    this.zoom=event
    console.log(event);
  }
 // Handle cluster click event
 onClusterClick(event:any){
setTimeout(() => {
  console.log(this.MapClickcoords)
  if (this.markerEvents.length!=0) {
    const mapdata:any=[]
    if(this.zoom>21){
      this.markerEvents.forEach(element=>{
        if(Math.round(element.lat * 10000) / 10000===Math.round(this.MapClickcoords.lat * 10000) / 10000){
          if(Math.round(element.lng * 10000) / 10000===Math.round(this.MapClickcoords.lng * 10000) / 10000){
            mapdata.push(element)
          }
        }
      })
    }
    if(mapdata.length!=0){
      this.ClusterTable(mapdata)
    }
  }
}, 100);
}
  clickedMarkergrp(label: Events, index: number, data:any, templateRef: TemplateRef<any>): void {
    console.log(data);
    this.dialog.open(templateRef);
    this.listgrplocation = data;
  }

  clickedMarker(label: Events, index: number, data:any, templateRef: TemplateRef<any>): void {
    console.log(data)
    let type = data.type;
    if (type === 'Users' && data.isConsumedData == false) {
      this.userid = data.id;
      this.dialog.open(UserDetailsComponent, {
        data: { data: data, type: 'user' },
        width: '500px'
      });
    }
    else if (type === "Sites" && data.isConsumedData == false) {
      this.siteid = data.id;
      this.dialog.open(SiteDetailsComponent, {
        data: { data: data, type: 'site' },
        width: '500px'
      });
    }
    else if (type === "Contacts" && data.isConsumedData == false) {
      let dialogRef = this.dialog.open(ContactDetailsComponent, {
        data: { data: data, type: 'contact' },
        width: '500px'
      });
    }
    // } 
    else if (data.isConsumedData == true) {
      this.dialog.open(templateRef);
      this.dialogshow = true;
      this.onseendata = data;
    }

  }


  showonssendata(data:any, templateRef: TemplateRef<any>) {
    if (data.isConsumedData == true) {
      this.dialog.open(templateRef);
      this.dialogshow = true;
      this.onseendata = data;
    }
  }
  showlocation(event:any, i:number) {
    console.log('log-4')
    this.lat = event.lat;
    this.lng = event.lng;
    this.markerEvents = [{
      lat: event.lat,
      lng: event.lng,
      id: event.id,
      type: event.type,
      single: true,
      title: event.title,
      code: event.code,
      email: event.email,
      IsMasked: event.IsMasked,
      phoneNumber: event.phoneNumber,
      position: event.position,
      codenaf: event.codenaf,
      isConsumedData: event.isConsumedData,
    }];
    this.grpbylocation = [];
    this.showtitle = this.markerEvents;
    this.showremove = true;
    this.index = i;
  }

  removelocation() {
    this.showremove = false;
    this.grpbylocation = this.basegrplocation;
  }

  closedialogbox() {
    this.dialog.closeAll();
  }


  configureData(data:any, startdate:any, enddate:any) {
    if (data == '2') {
      this.isPlanningData = false;
    }
    else {
      this.isPlanningData = true;
    }

    var timezoneOffset = new Date().getTimezoneOffset() * 60000;
    // this.mapService.getMapConfigurationFilter(this.isPlanningData, new Date(startdate - timezoneOffset).toISOString().slice(0, 10),
    //   new Date(enddate).toISOString().slice(0, 10)).subscribe((res) => {
    //     let sortedData = _.sortBy(res, ['title']);
    //     this.mapdataformat(sortedData)
    //   });

  }

  openDialog(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, { position: { top: '195px', left: '900px' }, })

  }

  AccountConfigure() {
    const MappingconfigurationformComponentDialog = this.dialog.open(MappingconfigurationformComponent, {
      position: { top: '195px', left: '900px' },
      autoFocus: false,
      disableClose: true,
      data: { mapscreen: true }
    });
    MappingconfigurationformComponentDialog.afterClosed().subscribe((result) => {
      console.log(result)
    })
  }

  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '600px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }

  ClusterTable(data:any) {
    const ClusterTable = this.dialog.open(ClusterTableComponent, {
      data: { data }
    });
    ClusterTable.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
// -------------- 
@Component({
  selector: 'event-list-dialog',
  templateUrl: 'event-list-dialog.html',
  styleUrls: ['./event-list-dialog.scss'],

})
export class EventListPopUpDialog implements OnInit {
  events: CalendarEvent[] = [];
  name: any;
  groupdata: any;
  groupindex: any;
  constructor(
    public dialogRef: MatDialogRef<EventListPopUpDialog>,
    private calendarService: CalendarService,
    private mapService: MapService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private messageService: MessageService
  ) { }
  refresh: Subject<any> = new Subject();
  eventData:any;
  eventUsers:any;
  clients:any;
  eventLists:any;
  userId:any;
  actions:any;
  ngOnInit() {
    const mapEvents:any=sessionStorage.getItem('mapEvents')
    let sessObj:any= JSON?.parse(mapEvents);
    console.log(sessObj);
    console.log(this.data, 'eventlist');
    this.name = this.data.eventId.title;
    var timezoneOffset = new Date().getTimezoneOffset() * 60000;
    this.mapService.findEventsByInviter(sessObj.id, sessObj.type, new Date(sessObj.startDate).toISOString().slice(0, 10), new Date(sessObj.endDate).toISOString().slice(0, 10)).subscribe((res) => {
      console.log(res);
      this.events = [];
      console.log(res);
      this.eventLists = res;
      console.log(this.eventLists, 'this.eventLists');
      this.eventLists.forEach((element:any) => {
        console.log(element, 'element');
        let colors: any = {
          red: { primary: '#ad2121', },
          blue: { primary: '#1E90FF', },
          green: { primary: '#008000', },
        };
        let eventcolor;
        if (element.color == "Blue") {
          eventcolor = colors.blue;
        } else if (element.color == 'green') {
          eventcolor = colors.green;
        }
        this.events.push({
          start: new Date(element.startDate),
          end: new Date(element.endDate),
          title: element.title,
          address: element.address,
          city: element.city,
          country: element.country,
          id: element.id,
          hasFile: element.hasFile,
          hasNote: element.hasNote,
          // color: eventcolor, 
          isPublic: element.isPublic,
          isProposalEvent: element.isProposalEvent,
          isEventCreator: element.isEventCreator,
          actions: this.actions,
          myValidationStatus: element.myValidationStatus,
          isInvitedUserEvent: element.isInvitedUserEvent,
          isSimulation: element.isSimulation,
          meta: { type: 'danger' }
        });
      });
      this.refresh.next();
    });
  }

  onClick(event:any, id:any) {
    const dialogRef = this.dialog.open(EventPopUpDialog, {
      width: '550px',
      disableClose: true,
      data: { eventId: id, dataevent: event },
    });
  }

  eventProposal(id:any) {
    sessionStorage.setItem('startdate', id.start);
    sessionStorage.setItem('eventInfo', JSON.stringify(id));
    const dialogRef = this.dialog.open(EventProposalComponent, {
      width: '900px',
      height: '500px',
      data: { eventId: id.id }
    });
  }

  openEditProposalDialog(id:any) {
    const openEditProposalDialog = this.dialog.open(EditProposalComponent, {
      width: '500px',
      data: { eventId: id }
    });
    openEditProposalDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

 

  onNoClick(): void {
    this.dialogRef.close();
  }

  openEditdEventDialog(id:any) {
    const openAddEventDialog = this.dialog.open(EditEventComponent, {
      width: '500px',
      data: { eventId: id }
    });

    openAddEventDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }

  deleteEvent(event:any) {
    console.log(event)
  }
  closedialogbox() {
    this.dialog.closeAll();
  }


}


function round(decimal_part: number, arg1: number) {
  throw new Error('Function not implemented.');
}

