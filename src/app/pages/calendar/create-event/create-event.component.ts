import { Component, OnInit, ViewChild, Inject, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { Contact } from 'src/app/core/models/contact.model';
import { Site } from 'src/app/core/models/site.model';
import { Category } from 'src/app/core/models/category.model';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { CalendarService } from 'src/app/core/services/calendar.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
// import * as _ from 'lodash';
import { MessageService } from 'src/app/core/services/message.service';
import { ManageimportComponent } from '../../management/manageimport/manageimport.component';
import { AddNotesComponent } from '../../files/components/add-notes/add-notes.component';
import { AddFileNotesComponent } from '../../files/components/add-file-notes/add-file-notes.component';
import { data, event } from 'jquery';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddFileComponent } from '../../files/components/add-file/add-file.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GoogleValidationAddressService } from 'src/app/core/services/google-validation-address.service';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { TranslateService } from '@ngx-translate/core';
import { ApiErrorMessagesComponent } from 'src/app/api-error-messages/api-error-messages.component';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
  providers: [AddFileNotesComponent, AddNotesComponent, DatePipe],
})
export class CreateEventComponent implements OnInit {
  @ViewChild('placesRef', { static: false }) placesRef!: GooglePlaceDirective;
  categories$!: Observable<Category[]>;
  CriticityId$!: Observable<any>;
  fileForm!: FormGroup;
  updateile:any= [];
  eventdailog = true;
  filesnotes = true;
  periodicity: any = [
    { id: '1', name: 'Daily' },
    { id: '2', name: 'Weekly' },
    { id: '3', name: 'Monthly' },
    { id: '4', name: 'Default' },
  ];
  users$:any = [];
  filteredusers:any = [];
  contacts$:any = [];
  filteredcontacts:any = [];
  sites$:any = [];
  filteredsites:any = [];
  usersgroup$:any = [];
  filteredusersgroup:any = [];
  contactsgroup$:any = [];
  filteredcontactsgroup:any = [];
  sitesgroup$:any = [];
  filteredsitesgroup:any = [];
  userGroupArray:any;
  contactArray:any;
  filterforuserlist: any;
  filterforcontactlist: any;
  filterforsiteslist: any;
  filterforuserGrouplist: any;
  filterforcontactGrouplist: any;
  filterforsiteGrouplist: any;
  minDate!: string;
  minTime: any;
  files: string[] = [];
  form!: FormGroup;
  showPeriodDate: boolean = false;
  showFilterDay: boolean = false;
  dropdown: boolean = false;
  selectedradioval: any;
  // selectedFile: ImageSnippet;
  viewtagmodel :any= {};
  showcheckbox!: boolean;
  selectednumeralval: any;
  tagarray :any= [];
  Freefeild :any= {};
  viewnumeral :any= {};
  showfreefeild!: boolean;
  value!: number;
  dropdownvalue :any= [1, 2, 3, 4];
  i = 1;
  tagViewModels :any= [];
  tags: any;
  dropdownfeild :any= {};
  datadelete: any;
  datadeleteindex: any;
  checked: any;
  selectedvalue: any;
  selectedtagvalue: any;
  screenType: any;
  selectedDays = [];
  color1: string = '#2889e9';
  googleAutoinput: any;
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

  trade = [
    { id: 1, label: 'Sunday', selected: true },
    { id: 2, label: 'Monday', selected: true },
    { id: 3, label: 'Tuesday', selected: true },
    { id: 4, label: 'Wednesday', selected: true },
    { id: 5, label: 'Thursday', selected: true },
    { id: 6, label: 'Friday', selected: true },
    { id: 7, label: 'Saturday', selected: true },
  ];

  listofcountry :any= [];
  listofcountry$ :any= [];
  viewmodel :any= {};
  categoryname: any;
  color: any;
  creatorId: any;
  quickSearchValue!: string;
  categories: any;
  totalitems: any;
  category: boolean = false;
  showcreate = 0;
  // value: any;
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];
  AdminStatus: any;
  options = {
    types: ['geocode'],
    componentRestrictions: {},
  };
  googleAutoinputScreen = true;
  NormalAddressScreen = false;
  todaydate = new Date();
  startTime:any;
  endTime:any;
  valuedata :any= '';
  timeZone :any= 'Europe/Paris';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<CreateEventComponent>,
    private userService: ManageUsersService,
    private contactsService: ManageContactsService,
    private manageSitesService: ManageSitesService,
    private dialog: MatDialog,
    private calendarService: CalendarService,
    private messageService: MessageService,
private _snackBar: MatSnackBar,
    public datepipe: DatePipe,   
    public zone: NgZone,
    public GooglePlace: GooglePlaceDirective,
    private http: HttpClient,
    private googleAddress: GoogleValidationAddressService,
    private translate: TranslateService
  ) {
    if (localStorage.getItem('lang')) {
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    } else {
      this.translate.use('English');
    }
    this.AdminStatus = localStorage.getItem('isAdmin');
    this.timeZone = localStorage.getItem('timeZone');
    // const dd = new Date(new Date().toLocaleString('en', { timeZone: this.timeZone }));
    // const time = this.datepipe.transform(dd, 'HH')
    // this.startTime = time + ':00'
    // const endtime = Number(time) + 1
    // this.endTime = endtime.toString() + ':00'
  }

  ngOnInit(): void {
    console.log(this.data.screenType);
    this.screenType = this.data.screenType;
    this.form = this.formBuilder.group({
      Title: ['', [Validators.required]],
      StartDate: [this.todaydate, [Validators.required]],
      StartTime: [this.startTime, [Validators.required]],
      EndDate: ['', [Validators.required]],
      EndTime: [this.endTime, [Validators.required]],
      PeriodicityTime: [''],
      Address: [''],
      GoogleAddress: [''],
      ZipCode: [''],
      City: [''],
      Country: [''],
      latitude: [''],
      longitude: [''],
      Description: ['', [Validators.required]],
      isPublic: [false],
      IsOnlineEvent: [true],
      keyword: [''],
      CriticityId: [3],
      PeriodicityId: [0],
      IsPeriodicity: false,
      IsSimulation: false,
      IsTemplate: false,
      PeriodicityEndDate: ['0001-01-01 00:00:00.0000000'],
      UserId: [''],
      UserGroupsId: ['' || []],
      ContactId: [''],
      SelactCountry: ['France'],
      ContactGroupsId: ['' || []],
      SiteId: [''],
      CategoryId: [131],
      Attachments: ['' || []],
      CategoryViewModel: [''],
      categoryname: [''],
      NumberOfUsers: [''],
      tagViewModels: [[]],
      tagType: [''],
      TagViewModels: [[]],
      Tagetitle: [''],
      tagdropdown: [''],
      ischecked: [''],
      numeralType: [''],
      freefeildTitle: ['', Validators.pattern("^[a-zA-Z -']+")],
      freefeildnumber: [''],
      feildname: [''],
      fieldvalue: [''],
      freefeildvalue: [''],
      dropdowntype: [''],
      dropdown: [''],
    });
    if (this.data.screenType == 'CreateEvent') {
      this.form.get('IsSimulation')?.setValue(false);
    } else {
      this.form.get('IsSimulation')?.setValue(true);
    }
    this.getdatafordroupdown();
    this.getAllcountryList();
  }

  getAllcountryList() {
    this.calendarService.getAllcountryList().subscribe((res: any) => {
      if (res) {
        this.listofcountry = res;
        this.listofcountry$ = this.listofcountry;
      }
    });
  }

  filterCountry(event:any) {
    const filterValue = event.toLowerCase();
    this.listofcountry$ = this.listofcountry.filter((option:any) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  selactcountry(value:any) {
    this.options = {
      types: ['geocode'],
      componentRestrictions: { country: value },
    };
    setTimeout(() => {
      this.placesRef.reset();
    }, 100);
  }
  ApplyEvent() {
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage(
        'This button allows you to add new Event',
        'Create Event'
      );
    } else {
      if (this.form.get('CategoryId')?.value == 'OffTime') {
        window.alert('Off-Time');
      } else {
        this.onSubmit();
      }
    }
  }

  // -----------
  onSubmit() {
    this.form.get('keyword')?.setValue(this.keywordlist);
    const isPublic = !this.form.get('isPublic')?.value;
    this.form.get('isPublic')?.setValue(isPublic);
    const formData = new FormData();
    formData.append('Title', this.form.get('Title')?.value);
    const startDate: any =
      this.datepipe.transform(this.form.value.StartDate, 'yyyy-MM-dd') + 
      'T' +
      this.form.value.StartTime;
    formData.append('StartDate', startDate); 
    const endDate: any =
      this.datepipe.transform(this.form.value.EndDate, 'yyyy-MM-dd') +
      'T' +
      this.form.value.EndTime;
    formData.append('EndDate', endDate);
    formData.append('Address', this.form.get('Address')?.value || '');
    formData.append('ZipCode', this.form.get('ZipCode')?.value || '');
    formData.append('City', this.form.get('City')?.value || '');
    formData.append('Country', this.form.get('Country')?.value || '');
    formData.append(
      'latitude',
      this.form.get('latitude')?.value == null || undefined
        ? 0
        : this.form.get('latitude')?.value
    );
    formData.append(
      'longitude',
      this.form.get('longitude')?.value == null || undefined
        ? 0
        : this.form.get('longitude')?.value
    );
    formData.append('Description', this.form.get('Description')?.value);
    formData.append('CriticityId', this.form.get('CriticityId')?.value);
    formData.append('PeriodicityId', this.form.get('PeriodicityId')?.value);
    formData.append('IsSimulation', this.form.get('IsSimulation')?.value);
    formData.append('IsPeriodicity', this.form.get('IsPeriodicity')?.value);
    formData.append('IsTemplate', this.form.get('IsTemplate')?.value);
    formData.append('isPublic', this.form.get('isPublic')?.value);
    formData.append('IsOnlineEvent', this.form.get('IsOnlineEvent')?.value);
    formData.append('keyword', this.form.get('keyword')?.value);
    formData.append(
      'PeriodicityEndDate',
      this.form.get('PeriodicityEndDate')?.value
    );
    formData.append('SiteId', this.form.get('SiteId')?.value || '');
    formData.append('CategoryId', this.form.get('CategoryId')?.value || 0);
    // formData.append('Attachments', this.form.get('Attachments')?.value);
    formData.append(
      'NumberOfUsers',
      this.form.value.UserId.length == 0 ? 0 : this.form.value.UserId.length
    );
    // formData.append('tagViewModels', this.form.get('tagViewModels')?.value);
    if (
      this.form.get('CategoryId')?.value == 0 ||
      this.form.get('CategoryId')?.value == null
    ) {
      formData.append('CategoryViewModel.Color', this.viewmodel['color'] || '');
      formData.append('CategoryViewModel.CreatorId', '' || '');
      formData.append(
        'CategoryViewModel.CategoryName',
        this.viewmodel['categoryName'] || ''
      );
    }
    if (this.value < 4) {
      formData.append('IsPeriodicity', 'true');
      formData.append('PeriodicityId', this.form.get('PeriodicityId')?.value);
      formData.append(
        'PeriodicityEndDate',
        this.datepipe.transform(
          this.form.value.PeriodicityEndDate,
          'yyyy-MM-dd'
        ) +
          'T' +
          this.form.value.PeriodicityTime
      );
    }
    if (this.value == 1) {
      for (var x = 0; x < this.selectedDays.length; x++) {
        formData.append('NamesOfDay[' + x + ']', this.selectedDays[x]);
      }
    }
    for (var x = 0; x < this.form.get('UserId')?.value.length; x++) {
      formData.append('UserId[' + x + ']', this.form.get('UserId')?.value[x]);
    }
    for (var x = 0; x < this.form.get('ContactId')?.value.length; x++) {
      formData.append(
        'ContactId[' + x + ']',
        this.form.get('ContactId')?.value[x]
      );
    }
    for (var x = 0; x < this.form.get('UserGroupsId')?.value.length; x++) {
      formData.append(
        'UserGroupsId[' + x + ']',
        this.form.get('UserGroupsId')?.value[x]
      );
    }
    for (var x = 0; x < this.form.get('ContactGroupsId')?.value.length; x++) {
      formData.append(
        'ContactGroupsId[' + x + ']',
        this.form.get('ContactGroupsId')?.value[x]
      );
    }
    if (this.tagarray.length == 0 || this.tagarray.length > 0) {
      this.tagarray.forEach((e:any, index:number) => {
        formData.append('TagViewModels[' + index + '].fieldName', e.fieldName);
        formData.append('TagViewModels[' + index + '].fieldType', e.fieldType);
        if (e.fieldType == 'Dropdown') {
          formData.append(
            'TagViewModels[' + index + '].dropdownValues',
            e.dropdownValues
          );
        } else {
          formData.append(
            'TagViewModels[' + index + '].fieldValue',
            e.fieldValue
          );
        }
      });
    }

    // Api call
    this.calendarService.createEvent(formData).subscribe((res: any) => {
      this._snackBar.open('Event create  successfully ', 'Undo', {
        duration: 3000,
      });
      this.messageService.showMessage('Event create  successfully'); 
      this.calendarService.createevent$.next(true);
      this.onCreateFile(res.response[0].message);
    },error=>{
      console.log(error)
      if(error.status==429){
        this.APIerrormessage(error?.error,'Create Events')
      }
    });
  }

  updateGroup(id:any) {
    console.log(id);
    let selectedRes:any = [];
    let usegrps = [];
    // _.forEach(id, (val:any) => {
    //   console.log(id, val);
    //   selectedRes.push(val.id);
    // });
    this.form.get('UserGroupsId')?.setValue(selectedRes);
  }

  radioChange(eve:any) {
    this.showPeriodDate = true;
    this.form.get('IsPeriodicity')?.setValue(true);
  }

  clear() {
    this.form.get('PeriodicityId')?.setValue(false);
  }
  changeTradesByCategory(event:any, id:number) {
    let a = event.target;
    console.log(event.target);
    if (event.target.checked === false) {
      this.trade.forEach((x) => {
        if (x.id === id) {
          x.selected = false;
        }
      });
    } else {
      this.trade.forEach((x) => {
        if (x.id === id) {
          x.selected = true;
        }
      });
    }
    let b;
    let array1:any= [];
    b = this.trade.filter((item) => item.selected === true);
    console.log('tradevlaueb' + b);
    console.log(b);
    b.filter((item) => {
      array1.push(item.label);
    });
    console.log(array1);
    this.selectedDays = array1;
  }

  onEventLog(event: string, data: any): void {
    this.viewmodel['id'] = 0;
    this.viewmodel['color'] = data;
    this.viewmodel['categoryName'] = this.form.get('categoryname')?.value;
  }

  updatecategory(v:any) {
    console.log(v);
    this.categoryname = v.categoryName;
    this.color = v.color;
    this.creatorId = v.creatorId;
  }

  createcategory() {
    this.category = true;
    this.showcreate = 1;
  }

  closecategory() {
    this.category = false;
    this.showcreate = 0;
    this.viewmodel['id'] = '';
    this.viewmodel['color'] = '';
    this.viewmodel['categoryName'] = '';
  }

  removecategory() {
    this.form.get('CategoryId')?.setValue(0);
  }

  importdata() {
    const openAddEventDialog = this.dialog.open(ManageimportComponent, {
      width: '600px',
      autoFocus: false,
      disableClose: true,
      data: 'Events',
    });
  }

  downloadTemplate() {
    const Name = 'Events';
    this.contactsService.downloadTemplate(Name).subscribe((result: Blob) => {
      const data: Blob = new Blob([result], {
        type: 'text/xlsx;charset=utf-8',
      });
      saveAs(data, 'Events.xlsx');
    });
  }

  // ------------
  onCreateFile(eventID:any) {
    this.calendarService.FindEventById(eventID).subscribe((res) => {
      if (res) {
        const addFileNotesDialog = this.dialog.open(AddFileNotesComponent, {
          data: {
            data: res,
            attachmentLevel: 'Events',
            ismanage: true,
          },
          disableClose: false,
          width: '500px',
          panelClass: ['files'],
        });
        addFileNotesDialog.afterClosed().subscribe((result) => {
          if (result) {
            this.ngOnInit();
            this.matDialogRef.close(true);
          }
        });
      }
    });
  }

  // ------------
  updateAddress(eve:any) {
    if (eve.value == undefined) {
      this.googleAutoinputScreen = true;
      this.NormalAddressScreen = false;
      this.form.get('IsOnlineEvent')?.setValue(true);
      this.form.get('Address')?.setValue('');
      this.form.get('ZipCode')?.setValue('');
      this.form.get('City')?.setValue('');
      this.form.get('Country')?.setValue('');
    } else {
      this.googleAutoinputScreen = false;
      this.NormalAddressScreen = true;
      this.form.get('IsOnlineEvent')?.setValue(false);
      this.form.get('IsOnlineEvent')?.disable();
      this.manageSitesService.fetchSiteByIdService(eve.value).subscribe((res) => {
          if (res) {
            this.form.get('Address')?.setValue(res.address);
            this.form.get('ZipCode')?.setValue(res.zipCode);
            this.form.get('City')?.setValue(res.city);
            this.form.get('Country')?.setValue(res.country);
          }
        });
    }
  }

  // ----------------
  // auto chip for keyword
  // -----------
  add(event: MatChipInputEvent) {
    console.log(event.value);
    const value = (event.value || '').trim();
    if (value) {
      this.keywordlist.push(value);
    }
    // Clear the input value
    event.input.value = '';
    this.form.get('keyword')?.setValue(null);
  }
  remove(value: string) {
    const index = this.keywordlist.indexOf(value);
    if (index >= 0) {
      this.keywordlist.splice(index, 1);
    }
  }

  // Add another feild

  showdropdown() {
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage(
        'This button allows you to add more parameter',
        'Add Tag'
      );
    } else {
      this.dropdown = true;
    }
  }

  selacttagType(): void {
    this.form.get('tagType')?.valueChanges.subscribe((val) => {
      console.log(val);
      this.selectedradioval = val;
    });
  }
  addAdditionalFieldLine() {
    this.dropdownvalue.push(this.form.get('dropdowntype')?.value);
  }
  // Add tage
  applytag() {
    console.log(this.form.value);
    if (this.selectedradioval == 'Checkbox') {
      this.viewtagmodel['fieldName'] = this.form.get('Tagetitle')?.value;
      this.viewtagmodel['fieldType'] = 'Bool';
      this.viewtagmodel['dropdownValues'] = '';
      this.tagarray.push(this.viewtagmodel);
      this.showcheckbox = true;
      this.tagViewModels.push(this.viewtagmodel);
    } else if (this.selectedradioval == 'Freefeild') {
      if (this.selectednumeralval == 'Alphanumeric') {
        this.Freefeild['fieldName'] = this.form.get('freefeildTitle')?.value;
        this.Freefeild['fieldType'] = 'Text';
        this.Freefeild['dropdownValues'] = '';
        this.tagarray.push(this.Freefeild);
        this.showfreefeild = true;
        this.tagViewModels.push(this.Freefeild);
      } else {
        this.viewnumeral['fieldName'] = this.form.get('freefeildnumber')?.value;
        this.viewnumeral['fieldType'] = 'Number';
        this.viewnumeral['dropdownValues'] = '';
        this.tagarray.push(this.viewnumeral);
        this.showfreefeild = true;
        this.tagViewModels.push(this.viewnumeral);
      }
    } else if (this.selectedradioval == 'Dropdown') {
      this.dropdownfeild['fieldName'] = this.form.get('Tagetitle')?.value;
      this.dropdownfeild['fieldType'] = 'Dropdown';
      this.dropdownfeild['dropdownValues'] =
        this.form.get('dropdowntype')?.value;
      this.tagViewModels.push(this.dropdownfeild);
    }
    console.log(this.tagViewModels);
  }

  checkChanges() {
    this.form.get('numeralType')?.valueChanges.subscribe((val) => {
      console.log(val);
      this.selectednumeralval = val;
    });
  }

  filterOptions(value: string, type: string): void {
    console.log(type);
    if (type === 'users') {
      this.filteredusers = this.users$.filter((option:any) =>
        option.firstName.toLowerCase().includes(value.toLowerCase())
      );
    } else if (type === 'Sites') {
      this.filteredsites = this.sites$.filter((option:any) =>
        option.companyName.toLowerCase().includes(value.toLowerCase())
      );
    } else if (type === 'Contacts') {
      this.filteredcontacts = this.contacts$.filter((option:any) =>
        option.firstName.toLowerCase().includes(value.toLowerCase())
      );
    } else if (type === 'UserGroups') {
      this.filteredusersgroup = this.usersgroup$.filter((option:any) =>
        option.groupName.toLowerCase().includes(value.toLowerCase())
      );
    } else if (type === 'ContactGroups') {
      this.filteredcontactsgroup = this.contactsgroup$.filter((option:any) =>
        option.groupName.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  getdatafordroupdown() {
    // get all users
    this.userService.findAllUsersDropdown().subscribe((result) => {
      if (result) {
        this.users$ = result;
        this.filteredusers = result;
      }
    });

    
    // get all contacts
    this.contactsService.findAllContactsDropdown().subscribe((result) => {
      if (result) {
        this.contacts$ = result;
        this.filteredcontacts = result;
      }
    });
    //get all sites
    this.manageSitesService.findAllSitesDropdown().subscribe((result) => {
      if (result) {
        this.sites$ = result;
        this.filteredsites = result;
      }
    });
    // get all User Group
    this.userService.findAllUsersGroupDropdown().subscribe((result) => {
      if (result) {
        this.usersgroup$ = result; 
        this.filteredusersgroup = result;
      }
    });
    // get all contact Group
    this.contactsService.findAllContactsGroupDropdown().subscribe((result) => {
      if (result) {
        this.contactsgroup$ = result;
        this.filteredcontactsgroup = result;
      }
    });

    // fetchCategoryService
    this.calendarService.fetchCategoryService(100, 1).subscribe((res) => {
      this.categories = res;
      this.totalitems = res.length;
    });
    this.CriticityId$ = this.calendarService.findCriticity();
  }

  // ------------0000000000000
  handleAddressChange(place: object) {
    const data = this.googleAddress.getFullAddress(place);
    this.form.get('IsOnlineEvent')?.setValue(false);
    this.form.get('IsOnlineEvent')?.disable();
    this.form.get('latitude')?.setValue(data.latitude);
    this.form.get('longitude')?.setValue(data.longitude);
    if (
      data.Address != undefined &&
      data.Address != null &&
      data.Address != 'undefined' &&
      data.Address != 'null'
    ) {
      this.form.get('Address')?.setValue(data.Address);
    } else {
      this.form.get('Address')?.setValue('');
    }
    if (
      data.pincode != undefined &&
      data.pincode != null &&
      data.pincode != 'undefined' &&
      data.pincode != 'null'
    ) {
      this.form.get('ZipCode')?.setValue(data.pincode);
    } else {
      this.form.get('ZipCode')?.setValue('');
    }
    if (
      data.city != undefined &&
      data.city != null &&
      data.city != 'undefined' &&
      data.city != 'null'
    ) {
      this.form.get('City')?.setValue(data.city);
    } else {
      this.form.get('City')?.setValue('');
    }
    if (
      data.country != undefined &&
      data.country != null &&
      data.country != 'undefined' &&
      data.country != 'null'
    ) {
      this.form.get('Country')?.setValue(data.country);
    } else {
      this.form.get('Country')?.setValue('');
    }
  }

  // --------
  get f() {
    return this.form.controls;
  }

  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '550px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
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
