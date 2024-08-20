import { Component, OnInit, Output, EventEmitter, Input, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { Observable } from 'rxjs';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { DataSharedService } from '../datashare.service';
import { FiltershareService } from '../filtershare.service';
import { DatePipe } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatOption } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { MapfilterService } from '../mapfilter.service';
@Component({
  selector: 'pm-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent implements OnInit {
  // autocomplete for 
  // auto chip for city
  separatorcityCodes: number[] = [ENTER, COMMA];
  citylist: string[] = [];
  CityApiList: string[] = [];

  // auto chip for country
  separatorcountryCodes: number[] = [ENTER, COMMA];
  countrylist: string[] = [];
  countryApiList: string[] = [];
  // auto chip for zipCode
  separatorzipCodeCodes: number[] = [ENTER, COMMA];
  zipCodelist: string[] = [];
  zipCodeApiList: string[] = [];
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];
  keywordApiList: string[] = ['keyword1', 'keyword2', 'keyword3', 'keyword4', 'keyword5'];
  // -------- 
  @Output() newItemEvent = new EventEmitter<any>();
  @ViewChild('allusergroupSelected') private allusergroupSelected!: MatOption;
  @ViewChild('alluserSelected') private alluserSelected!: MatOption;
  @ViewChild('allContactgroupSelected') private allContactgroupSelected!: MatOption;
  @ViewChild('allContactSelected') private allContactSelected!: MatOption;
  @ViewChild('allSitegroupSelected') private allSitegroupSelected!: MatOption;
  @ViewChild('allSitesSelected') private allSitesSelected!: MatOption;
  private valueChange: EventEmitter<boolean> = new EventEmitter();
  filterForm: FormGroup;
  managementType!: Array<{ id: number, name: string, value: string }>;
  operators!: Array<{ id: number, name: string, value: string }>;
  distance!: Array<{ id: number, name: string, value: string }>;
  duration!: Array<{ id: number, name: string, value: string }>;
  criticals: any = [];
  selectedMgmt!: string;
  selectedOper!: string;
  selectedType!: string;
  selectedDuration!: string;
  keywords: string[] = [];
  isCarte: boolean = false;
  categories$!: Observable<any[]>;
  // -------------- 
  users$:any;
  contacts$:any;
  sites$:any;
  userGroups$:any;
  contactGroups$:any;
  siteGroups$:any;
  // ---------- 
  filteredList1:any;
  filteredList2:any;
  filteredList3:any;
  filteredList4:any;
  filteredList5:any;
  filteredList6:any;
  // -------------- 
  @Input()
  viewDateChange!: Date;
  result: any;
  dataaaas: any;
  IsNoDisplay!: boolean;
  IsNoTarget!: boolean;
  IsAchieved!: boolean;
  IsNotAchieved!: boolean;
  ismonthly!: boolean;
  IsYearly!: boolean;
  // -------------- 
  constructor(
    private matDialogRef: MatDialogRef<FilterModalComponent>,
    private formBuilder: FormBuilder,
    private calendarService: CalendarService,
    private manageUsersService: ManageUsersService,
    private manageContactsService: ManageContactsService,
    private manageSitesService: ManageSitesService,
    private sharedService: DataSharedService,
    public datepipe: DatePipe,
    public fileshareservice: FiltershareService,
    public MapfilterService: MapfilterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService ,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
    
    this.filterForm = this.formBuilder.group({
      nameOfTheSite: ['', Validators.required],
      CategoryId: ['', Validators.required],
      managementTypeId: ['', Validators.required],
      GroupsId: ['', Validators.required],
      selactedId: ['', Validators.required],
      eventsTitle: [''],
      eventsCriticLevel: [''],
      eventsOperatorsId: ['', Validators.required],
      eventsDuration: [''],
      eventsDurationId: ['', Validators.required],
      planningDate: [''],
      groupe: [''],
      site: [''],
      userFree: [''],
      IsPublic: [true],
      IsPrivate: [true],
      IsOnlineEvent: [true],
      IsOfflineEvent: [true],
      visit: [''],
      companyName: [''],
      name: [''],
      sites: [''],
      firstName: [''],
      lastName: [''],
      keyword: [''],
      zipCode: [''],
      operatorsId: ['', Validators.required],
      distance: [''],
      distanceId: ['', Validators.required],
      siretNumber: [''],
      transactionDate: [''],
      volume: [''],
      price: [''],
      targetFilter: ['nodisplay'],
      acheiveFilter: [''],
      city: [''],
      country: [''],
      Monthlytarget: [''],
      Yearlytarget: ['']
    });

    //this.categories$ = this.calendarService.fetchCategoryService(100, 1);
    // this.userGroups$ = this.manageUsersService.fetchUserGroupsService(100,1)
    // this.contactGroups$ = this.manageContactsService.fetchContactGroupsService(100,1)
    // this.siteGroups$ = this.manageSitesService.fetchSiteGroupsService(100,1)
    this.calendarService.fetchCategoryService(100, 1).subscribe((res) => {
      console.log(res);
      this.categories$ = res;
    });
    this.calendarService.findCriticity().subscribe((res) => {
      console.log(res);
      this.criticals = res;
    });
    this.manageUsersService.findAllUsersDropdown().subscribe((res) => {
      this.users$ = res;
      this.users$.sort(function (a:any, b:any) {
        var textA = a.firstName.toUpperCase();
        var textB = b.firstName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.filteredList1 = this.users$.slice();
    });
    this.manageContactsService.findAllContactsDropdown().subscribe((res) => {
      this.contacts$ = res;
      this.contacts$.sort(function (a:any, b:any) {
        var textA = a.firstName.toUpperCase();
        var textB = b.firstName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.filteredList2 = this.contacts$.slice();
    });
    this.manageSitesService.findAllSitesDropdown().subscribe((res) => {
      this.sites$ = res;
      console.log(this.sites$)
      this.sites$.sort(function (a:any, b:any) {
        var textA = a.companyName.toUpperCase();
        var textB = b.companyName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.filteredList3 = this.sites$.slice();
      console.log(this.filteredList3);
    });

    this.manageUsersService.fetchUserGroupsService(100, 1).subscribe((res) => {
      this.userGroups$ = res;
      this.userGroups$.sort(function (a:any, b:any) {
        var textA = a.userGroupName.toUpperCase();
        var textB = b.userGroupName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.filteredList4 = this.userGroups$.slice();
    });

    this.manageContactsService.fetchContactGroupsService(100, 1, '').subscribe((res) => {
      this.contactGroups$ = res;
      this.contactGroups$.sort(function (a:any, b:any) {
        var textA = a.contactGroupName.toUpperCase();
        var textB = b.contactGroupName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.filteredList5 = this.contactGroups$.slice();
    });
    this.manageSitesService.fetchSiteGroupsService(100, 1).subscribe((res) => {
      this.siteGroups$ = res;
      this.siteGroups$.sort(function (a:any, b:any) {
        var textA = a.siteGroupName.toUpperCase();
        var textB = b.siteGroupName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.filteredList6 = this.siteGroups$.slice();
    });

  }

  ngOnInit() {
    let url = window.location.href;
    this.isCarte = url.includes('carte');
    if (this.isCarte == true) {
      this.filterForm.get('managementTypeId')?.setValue('Users')
      this.selectedMgmt = 'Users'
    } else {
      this.filterForm.get('managementTypeId')?.setValue('Events')
      this.selectedMgmt = 'Events'
    }
    this.managementType = [
      { id: 0, name: 'Events', value: 'events' },
      { id: 1, name: 'User', value: 'user' },
      { id: 2, name: 'Sites', value: 'sites' },
      { id: 3, name: 'Contacts', value: 'contacts' },
      { id: 4, name: 'Prodcuts', value: 'products' }
    ];

    this.operators = [
      { id: 0, name: '<', value: '>' },
      { id: 1, name: '<', value: '<' },
      { id: 2, name: '>=', value: '>=' },
      { id: 3, name: '<=', value: '<=' },
    ];
    this.distance = [
      { id: 0, name: 'KM', value: 'km' },
      { id: 1, name: 'Miles', value: 'mi' },
    ];
    this.duration = [
      { id: 0, name: 'KM', value: 'km' },
      { id: 1, name: 'Miles', value: 'mi' },
    ];

    this.onChanges();
  }


  close() {
    this.sharedService.sendClickEvent();
    this.valueChange.emit(true);

  }

  fetchData() {
    this.filterForm.get('keyword')?.setValue(this.keywordlist.toString());
    this.filterForm.get('city')?.setValue(this.citylist.toString());
    this.filterForm.get('country')?.setValue(this.countrylist.toString());
    this.filterForm.get('zipCode')?.setValue(this.zipCodelist.toString());
    console.log(this.filterForm.value)
    this.close();
    sessionStorage.setItem("FilterValue", JSON.stringify(this.filterForm.value));
    sessionStorage.setItem("SelectedFilter", this.selectedMgmt);
    // carte true 
    if (this.isCarte) {
      sessionStorage.setItem("FilterType", 'map');
      this.checktargetFilter()
      if (this.selectedMgmt == 'Users') {
        const params = this.getparams('UsersId=', 'management')
        this.MapfilterService.mapfilterDetails$.next(params);
        this.matDialogRef.close();
      }
      if (this.selectedMgmt == 'Contacts') {
        const params = this.getparams('ContactsId=', 'management')
        this.MapfilterService.mapfilterDetails$.next(params);
        this.matDialogRef.close();
      }
      if (this.selectedMgmt == 'Sites') {
        const params = this.getparams('SitesId=', 'management')
        this.MapfilterService.mapfilterDetails$.next(params);
        this.matDialogRef.close();
      }
    } else {
      sessionStorage.setItem("FilterType", 'event');
      this.checktargetFilter()
      if (this.selectedMgmt == 'Events') {
        const params = this.getparams('', 'Event')
        this.fileshareservice.filterDetails$.next(params);
        this.matDialogRef.close();
      } else {
        if (this.selectedMgmt == 'Users') {
          const params = this.getparams('UsersId=', 'management')
          this.fileshareservice.filterDetails$.next(params);
          this.matDialogRef.close();
        }
        if (this.selectedMgmt == 'Contacts') {
          const params = this.getparams('ContactsId=', 'management')
          this.fileshareservice.filterDetails$.next(params);
          this.matDialogRef.close();
        }
        if (this.selectedMgmt == 'Sites') {
          const params = this.getparams('SitesId=', 'management')
          this.fileshareservice.filterDetails$.next(params);
          this.matDialogRef.close();
        }
      }
    }
  }

  onChanged(event: any) {
    let managementType = this.managementType.filter(s => s.id === event.value);
    this.selectedMgmt = managementType[0].value;
  }

  onOperatorsChanged(event: any) {
    const filterText = this.operators.filter(s => s.id === event.value);
    this.selectedOper = filterText[0].value;
  }

  onDistanceChanged(event: any) {
    // this.selectedType = filterText.value;
  }

  onDurationChanged(event: any) {
    //this.selectedDuration = filterText.value;
  }
  checkFilter() {
    if (this.filterForm.get('targetFilter')?.value == 'target') {
      return true;
    } else {
      return false;
    }
  }


  onChanges(): void {
    this.filterForm.get('managementTypeId')?.valueChanges.subscribe(val => {
      this.selectedMgmt = val;
      if (val == 'Users') {
        this.filterForm.get('GroupsId')?.patchValue([]);
        this.filterForm.get('UsersId')?.patchValue([]);
      } else if (val == 'Contacts') {
        this.filterForm.get('GroupsId')?.patchValue([]);
        this.filterForm.get('ContactsId')?.patchValue([]);
      } else if (val == 'Sites') {
        this.filterForm.get('GroupsId')?.patchValue([]);
        this.filterForm.get('SitesId')?.patchValue([]);
      }
    });
  }

  checkentity(value:any) {
    this.selectedMgmt = value
  }


  SelectionAllUserGroup() {
    if (this.allusergroupSelected.selected) {
      this.allusergroupSelected.value = 0;
      this.filterForm.get('GroupsId')?.patchValue([...this.filteredList4.map((item:any) => item.id), 0,]);
    } else {
      this.filterForm.get('GroupsId')?.patchValue([]);
    }
  }

  SelectionAllUser() {
    if (this.alluserSelected.selected) {
      this.alluserSelected.value = 0;
      this.filterForm.get('UsersId')?.patchValue([...this.filteredList1.map((item:any) => item.id), 0,]);
    } else {
      this.filterForm.get('UsersId')?.patchValue([]);
    }
  }

  SelectionAllContactGroup() {
    if (this.allContactgroupSelected.selected) {
      this.allContactgroupSelected.value = 0;
      this.filterForm.get('GroupsId')?.patchValue([...this.filteredList5.map((item:any) => item.id), 0,]);
    } else {
      this.filterForm.get('GroupsId')?.patchValue([]);
    }
  }
  SelectionAllContact() {
    if (this.allContactSelected.selected) {
      this.allContactSelected.value = 0;
      this.filterForm.get('ContactsId')?.patchValue([...this.filteredList2.map((item:any) => item.id), 0,]);

    } else {
      this.filterForm.get('ContactsId')?.patchValue([]);
    }
  }

  SelectionAllSiteGroup() {
    if (this.allSitegroupSelected.selected) {
      this.allSitegroupSelected.value = 0;
      this.filterForm.get('GroupsId')?.patchValue([...this.filteredList6.map((item:any) => item.id), 0,]);

    } else {
      this.filterForm.get('GroupsId')?.patchValue([]);
    }
  }
  SelectionAllSites() {
    if (this.allSitesSelected.selected) {
      this.allSitesSelected.value = 0;
      this.filterForm.get('SitesId')?.patchValue([...this.filteredList3.map((item:any) => item.id), 0,]);

    } else {
      this.filterForm.get('SitesId')?.patchValue([]);
    }
  }
  // filtercity 
  filtercity(value:any) {
    const Entity = this.selectedMgmt;
    const suggestionFor = '1'
    this.manageUsersService.GetSuggestions(Entity, suggestionFor, value).subscribe((res: any) => {
      if (res) {
        this.CityApiList.length = 0
        res.forEach((e:any) => {
          this.CityApiList.push(e)
        })
      }
    })
  }
  // filtercountry
  filtercountry(value:any) {
    const Entity = this.selectedMgmt;
    const suggestionFor = '2'
    this.manageUsersService.GetSuggestions(Entity, suggestionFor, value).subscribe((res: any) => {
      if (res) {
        this.countryApiList.length = 0
        res.forEach((e:any) => {
          this.countryApiList.push(e)
        })
      }
    })
  }
  // filterzipcode 
  filterzipcode(value:any) {
    const Entity = this.selectedMgmt;
    const suggestionFor = '0'
    this.manageUsersService.GetSuggestions(Entity, suggestionFor, value).subscribe((res: any) => {
      if (res) {
        this.zipCodeApiList.length = 0
        res.forEach((e:any) => {
          this.zipCodeApiList.push(e)
        })
      }
    })
  }
  // auto chip for keyword 
  // ----------- 
  add(event: MatChipInputEvent, type:any) {
    console.log(event.value)
    const value = (event.value || '').trim();
    // Add our fruit
    if (type == 'keyword') {
      if (value) {
        this.keywordlist.push(value);
      }
      // Clear the input value
      event.input.value = ''
      this.filterForm.get('keyword')?.setValue(null);
    } else if (type == 'city') {
      if (value) {
        this.citylist.push(value);
      }
      // Clear the input value
      event.input.value = ''
      this.filterForm.get('city')?.setValue(null);
    } else if (type == 'country') {
      if (value) {
        this.countrylist.push(value);
      }
      // Clear the input value
      event.input.value = ''
      this.filterForm.get('country')?.setValue(null);
    } else if (type == 'zipCode') {
      if (value) {
        this.zipCodelist.push(value);
      }
      // Clear the input value
      event.input.value = ''
      this.filterForm.get('zipCode')?.setValue(null);
    }

  }
  remove(value: string, type:any) {
    console.log(type)
    if (type == 'keyword') {
      const index = this.keywordlist.indexOf(value);
      if (index >= 0) {
        this.keywordlist.splice(index, 1);
      }
    } else if (type == 'city') {
      const index = this.citylist.indexOf(value);
      if (index >= 0) {
        this.citylist.splice(index, 1);
      }
    } else if (type == 'country') {
      const index = this.countrylist.indexOf(value);
      if (index >= 0) {
        this.countrylist.splice(index, 1);
      }
    } else if (type == 'zipCode') {
      const index = this.zipCodelist.indexOf(value);
      if (index >= 0) {
        this.zipCodelist.splice(index, 1);
      }
    }

  }

  selected(event: MatAutocompleteSelectedEvent, type:any) {
    console.log(type)
    if (type == 'keyword') {
      this.keywordlist.push(event.option.viewValue);
      this.filterForm.get('keyword')?.setValue(null);
    } else if (type == 'city') {
      this.citylist.push(event.option.viewValue);
      this.filterForm.get('city')?.setValue(null);
    } else if (type == 'country') {
      this.countrylist.push(event.option.viewValue);
      this.filterForm.get('country')?.setValue(null);
    } else if (type == 'zipCode') {
      this.zipCodelist.push(event.option.viewValue);
      this.filterForm.get('zipCode')?.setValue(null);
    }

  }


  getparams(name:any, type:any) {
    if (type == 'management') {
      let params = name + (this.filterForm.value.selactedId).toString() + '&GroupsId=' + (this.filterForm.value.GroupsId).toString() + '&keyword=' + this.filterForm.value.keyword + '&City=' + this.filterForm.value.city + '&Country=' + this.filterForm.value.country + '&ZipCode=' + this.filterForm.value.zipCode + '&AdvancedSearch=' + this.selectedMgmt
        + '&TargetFilterViewModel.IsNoDisplay=' + this.IsNoDisplay + '&TargetFilterViewModel.IsNoTarget=' + this.IsNoTarget + '&TargetFilterViewModel.IsAchieved=' + this.IsAchieved + '&TargetFilterViewModel.IsNotAchieved=' + this.IsNotAchieved + '&TargetFilterViewModel.IsMonthly=' + this.ismonthly + '&TargetFilterViewModel.IsYearly=' + this.IsYearly + '&startDate=' + this.data.startdate + '&endDate=' + this.data.enddate;
      return params
    } else {
      let params = 'CategoryId=' + this.filterForm.value.CategoryId + '&Title=' + this.filterForm.value.eventsTitle + '&keyword=' + this.filterForm.value.keyword + '&IsPublic=' + this.filterForm.value.IsPublic + '&IsPrivate=' + this.filterForm.value.IsPrivate + '&IsOnlineEvent=' + this.filterForm.value.IsOnlineEvent + '&IsOfflineEvent=' + this.filterForm.value.IsOfflineEvent + '&CriticLevel=' + this.filterForm.value.eventsCriticLevel + '&AdvancedSearch=' + this.selectedMgmt + '&startDate=' + this.data.startdate + '&endDate=' + this.data.enddate;
      return params
    }
  }

  checktargetFilter() {
    if (this.filterForm.value.targetFilter == 'nodisplay') {
      this.IsNoDisplay = true;
      this.IsNoTarget = false;
      this.IsAchieved = false;
      this.IsYearly = false;
      this.ismonthly = false;
      this.IsNotAchieved = false;
    }
    else if (this.filterForm.value.targetFilter == 'notarget') {
      this.IsNoDisplay = false;
      this.IsNoTarget = true;
      this.IsAchieved = false;
      this.IsYearly = false;
      this.ismonthly = false;
      this.IsNotAchieved = false;
    }
    else if (this.filterForm.value.targetFilter == 'target') {
      this.IsNoDisplay = false;
      this.IsNoTarget = false;
      this.IsAchieved = false;
      this.IsNotAchieved = false;
      if (this.filterForm.value.Monthlytarget == true && this.filterForm.value.Yearlytarget == false) {
        this.ismonthly = true;
        this.IsYearly = false;
        this.IsAchieved = false;
        this.IsNotAchieved = false;
        if (this.filterForm.value.acheiveFilter == 'acheive') {
          this.IsAchieved = true;
          this.IsNotAchieved = false;
        }
        if (this.filterForm.value.acheiveFilter == 'notacheive') {
          this.IsNotAchieved = true;
          this.IsAchieved = false;
        }
      }
      else if (this.filterForm.value.Yearlytarget == true && this.filterForm.value.Monthlytarget == false) {
        this.IsYearly = true;
        this.ismonthly = false;
        this.IsAchieved = false;
        this.IsNotAchieved = false;
        if (this.filterForm.value.acheiveFilter == 'acheive') {
          this.IsAchieved = true;
          this.IsNotAchieved = false;
        }
        else if (this.filterForm.value.acheiveFilter == 'notacheive') {
          this.IsNotAchieved = true;
          this.IsAchieved = false;
        }
      }
      else if (this.filterForm.value.Monthlytarget == true && this.filterForm.value.Yearlytarget == true) {
        this.ismonthly = true;
        this.IsYearly = true;
        this.IsAchieved = false;
        this.IsNotAchieved = false;
        if (this.filterForm.value.acheiveFilter == 'acheive') {
          this.IsAchieved = true;
          this.IsNotAchieved = false;
        }
        else if (this.filterForm.value.acheiveFilter == 'notacheive') {
          this.IsNotAchieved = true;
          this.IsAchieved = false;
        }
      }
    }
    else if (this.filterForm.value.targetFilter == '') {
      this.IsNoDisplay = false;
      this.IsNoTarget = false;
      this.IsYearly = false;
      this.ismonthly = false;
      this.IsAchieved = false;
      this.IsNotAchieved = false;
    }
  }

}
