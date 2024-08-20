import { Component, Inject, NgZone, ViewChild, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ManageimportComponent } from '../../manageimport/manageimport.component';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { saveAs } from 'file-saver';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { ApiErrorMessagesComponent } from 'src/app/api-error-messages/api-error-messages.component';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { AddFileNotesComponent } from 'src/app/pages/files/components/add-file-notes/add-file-notes.component';
import { CreateEventComponent } from 'src/app/pages/calendar/create-event/create-event.component';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { MessageService } from 'src/app/core/services/message.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { HttpClient } from '@angular/common/http';
import { GoogleValidationAddressService } from 'src/app/core/services/google-validation-address.service';
import { TranslateService } from '@ngx-translate/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { Category } from 'src/app/core/models/category.model';
// import * as _ from 'lodash';
import { AddtagCommonComponent } from 'src/app/pages/commonForAll/addtag-common/addtag-common.component';
import { MatSelectChange } from '@angular/material/select';
import { ConformationComponent } from '../../management-initiatives/conformation/conformation.component';

@Component({
  selector: 'app-create-milestone',
  templateUrl: './create-milestone.component.html',
  styleUrls: ['./create-milestone.component.scss']
})
export class CreateMilestoneComponent implements OnInit {
  @ViewChild('placesRef', { static: false }) placesRef!: GooglePlaceDirective;
  categories$!: Observable<Category[]>;
  CriticityId$!: Observable<any>;
  fileForm!: FormGroup;
  updateile!: [];
  eventdailog = true;
  filesnotes = true;
  periodicity: any = [
    { id: '1', name: 'Daily' },
    { id: '2', name: 'Weekly' },
    { id: '3', name: 'Monthly' },
    { id: '4', name: 'Default' },
  ];
  users$ :any= [];
  filteredusers :any= [];
  contacts$ :any= [];
  filteredcontacts :any= [];
  sites$ :any= [];
  filteredsites :any= [];
  usersgroup$ :any= [];
  filteredusersgroup :any= [];
  contactsgroup$ :any= [];
  filteredcontactsgroup :any= [];
  sitesgroup$ :any= [];
  filteredsitesgroup :any= [];
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
  files: string[]= [];
  form: FormGroup;
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
  dropdownvalue = [1, 2, 3, 4];
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
  selectedDays :any= [];
  color1: string = '#2889e9';
  googleAutoinput: any;
  selectedrole: any = '1';
  publiccheckboxstatus:boolean=false;
  Userdropdownstatus:boolean=false;

  isChild: boolean = true;
  isPredecessor: boolean = false;
  isSuccessor: boolean = false;
  loader = false
  listofPipelines:any
  listofPipelines$ :any= []
  listofinitiatives:any
  listofinitiatives$:any = []
  listofisPredecessor:any
  listofisPredecessor$:any = []
  listofisSuccessor:any
  listofisSuccessor$ = []
  listofSteps = []
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
  startTime:any
  valuedata = '';
  timeZone :any= 'Europe/Paris';
  taskiddata: any;
  listofTasks:any
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
  FindTaskStep: any;
  userGroups$: any;
  filteredList4: any;
  successorlist: any;
  predecessorlist: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<CreateMilestoneComponent>,
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
    private manageUserService: ManageUsersService,
    private googleAddress: GoogleValidationAddressService,
    private translate: TranslateService,
    private manageUsersService: ManageUsersService,
    private manageContactsService: ManageContactsService,


  ) {
    if (localStorage.getItem('lang')) {
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    } else {
      this.translate.use('English');
    }
    this.AdminStatus = localStorage.getItem('isAdmin');
    this.timeZone = localStorage.getItem('timeZone');
    this.form = this.formBuilder.group({
      id: [''],
      ParentId: [''],
      Title: ['', [Validators.required]],
      IsPublic:[true],
      PermittedUserIds:[],
      StartDate: [new Date()],
      // StartDate: ['0001-01-01 00:00:00.0000000'],
      EndDate: [,[Validators.required]],
      EndTime: [null,[Validators.required]],
      Address: [''],
      GoogleAddress: [''],
      ZipCode: [],
      City: [''],
      Country: [''],
      latitude: [],
      longitude: [],
      Description: [''],
      keyword: [''],
      CriticityId: [3],
      IsTemplate: false,
      UserId: [],
      UserGroupsId: ['' || []],
      ContactId: [],
      SelactCountry: ['France'],
      ContactGroupsId: ['' || []],
      SiteId: [],
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
      IsPredecessortask: [false],
      IsSuccessortask: [false],
      freefeildTitle: [''],
      freefeildnumber: [''],
      feildname: [''],
      fieldvalue: [''],
      freefeildvalue: [''],
      dropdowntype: [''],
      dropdown: [''],
      Hours: [0],
      Minutes: ['0'],
      Period: [0],
      Addtages: this.formBuilder.array([]),
      HasStep: [false],
      PipeLinetype: ['2'],
      AddSteps: this.formBuilder.array([]),
      pipelineID: [null],
      Pipelinename: [''],
      IsSavePipeline: [],
      Stage: [2],
      IsMileStone: [true] ,
      initiatives:[],
      ListofSuccessor:[''],
      ListofPredecessor:['']
    });
  }

  ngOnInit(): void {
    console.log(this.data);
    this.screenType = this.data.type;
    if(this.screenType == 'Create-subTask'||this.screenType=='Create-task'||this.screenType == 'Create-task-initiatives'||this.screenType=='Create-subTask'||this.screenType=='addsubtask'||this.screenType == 'edit-task-initiatives' || this.screenType == 'View-task-initiatives'){
      if(this.data?.initiative){
        if(this.data?.initiative?.isPublic==false){
          this.form.get('IsPublic')?.setValue(this.data.initiative.isPublic)
          this.form.get('PermittedUserIds')?.setValue(this.data.initiative.PermittedUserIds)
          this.publiccheckboxstatus=true
        }else{
          this.form.get('IsPublic')?.setValue(this.data.initiative.isPublic)
          this.publiccheckboxstatus=true
        }
        if(this.data?.initiative?.UsersConditions){
          let ids:any=[]
          this.data?.initiative?.UsersConditions.forEach((element:any) => {
            ids.push(element.userId)
          });
          this.form.get('UserId')?.setValue(ids)
          this.Userdropdownstatus=true

        }
      }
    }
    if (this.screenType == 'Create-subTask') {
      this.form.get('ParentId')?.setValue(this.data.data.id)
    }

    if (this.screenType == 'edit-task') {
      this.manageUserService.FindTaskById(this.data.data.id).subscribe((res: any) => {
        this.taskiddata = res;
        this.getOneTask()
      })
    }
    if (this.screenType == 'edit-task-initiatives' || this.screenType == 'View-task-initiatives') {
      this.taskiddata = this.data.data;
      console.log("mileeeeee", this.taskiddata)
      this.getOneTask()
    }
    if(this.screenType=='Create-task'||this.screenType=='Create-task-initiatives'||this.screenType=='Create-subTask'||this.screenType=='addsubtask'||this.screenType=='Create-Milestone'){
      this.gettags();
    }
    this.getdatafordroupdown();
  }


  getIsPublicstatus(){
    return this.form.get('IsPublic')?.value
  }


  getPredecessorstatus(){
    return this.form?.value.IsPredecessortask
  }
  getSuccessorstatus(){
    return this.form?.value.IsSuccessortask
  }

  getSteps() {
    return this.form.get("AddSteps") as FormArray
  }
  AddSteps() {
    this.getSteps().push(this.newSteps());
  }
  RemoveStep(i:number){
    this.getSteps().removeAt(i)
  }

  newSteps(): FormGroup {
    return this.formBuilder.group({
      name: [''],
      Step: [''],
      Progress: [0],

    })
  }
  getpercentage(i:number){
    return this.getSteps().at(i).get('Progress')?.value
  }
  getpipelinestatus(){
    if(this.form?.value.pipelineID!=''||this.form?.value.Pipelinename!=''){
      return true
    }else{
      return false
    }

  }
  removetask(i:number) {
    this.getSteps().removeAt(i)
  }

  getaddstepsstatus() {
    return this.form?.value.HasStep
  }

  filterOptionsforPredecessor(value: string): void {
    this.listofisPredecessor = this.listofisPredecessor$.filter((option:any) =>
      option.title.toLowerCase().includes(value.toLowerCase())
    );
}
filterOptionsforSuccessor(value: string): void {
  this.listofisSuccessor = this.listofisSuccessor$.filter((option:any) =>
    option.title.toLowerCase().includes(value.toLowerCase())
  );
}
filterOptionsforinitiatives(value: string): void {
  this.listofinitiatives = this.listofinitiatives$.filter((option:any) =>
    option.title.toLowerCase().includes(value.toLowerCase())
  );
}
filterOptionsforExistingPipeline(value: string): void {
  this.listofPipelines = this.listofPipelines$.filter((option:any) =>
    option.name.toLowerCase().includes(value.toLowerCase())
  );
}
  getAllPipelines(): void {
    this.userService.FindPipelinesfortask().subscribe((result) => {
      if (result) {
        this.listofPipelines = result;
        this.listofPipelines$ = result;
      }
    });
  }
  getAllinitiatives(): void {
    this.userService.FindAllInitiatives().subscribe((result) => {
      if (result) {
        this.listofinitiatives = result;
        this.listofinitiatives$ = result;
      }
    });
  }
  getAllisPredecessor(){
    this.userService.FindAllTasksByisPredecess(true,false).subscribe((result) => {
      if (result) {
        this.listofisPredecessor = result;
        this.listofisPredecessor$ = result;
      }
    });
  }
  getAllisSuccessor(){
    this.userService.FindAllTasksByisSuccessor(false,true).subscribe((result) => {
      if (result) {
        this.listofisSuccessor = result;
        this.listofisSuccessor$ = result;
      }
    });
  }

  onSelectionChange(event: MatSelectChange) {
    this.userService.FindExistPipelineSteps(event?.value).subscribe((result) => {
      if (result) {
        this.listofSteps = result
        this.listofSteps.forEach((element:any, index:number) => {
          this.AddSteps()
             this.getSteps().at(index).get('name')?.setValue(element.stepName ? element.stepName : element.name)
          this.getSteps().at(index).get('Step')?.setValue(element.step)
          this.getSteps().at(index).get('Progress')?.setValue(element.progress)
        });
      }
    })
  }


  getPipeLinetype() {
    return this.form?.value.PipeLinetype
  }
  gettageBody() {
    return this.form.get('Addtages') as FormArray;
  }
  addtageBody() {
    this.gettageBody().push(this.createtageBody());
  }
  fieldname(i: number) {
    return this.gettageBody().at(i).get('fieldName')?.value;
  }

  dropdownvaluetotal(i: number) {
    return this.gettageBody().at(i).get('dropdownvaluetotal')?.value.split(',');
  }
  createtageBody(): FormGroup {
    return this.formBuilder.group({
      tagTableId: 0,
      creatorId:[null],
      fieldName: '',
      fieldType: '',
      fieldValue: '',
      dropdownValues: '',
      dropdownvaluetotal: '',
    });
  }
  fieldType(i: number) {
    return this.gettageBody().at(i).get('fieldType')?.value;
  }
  tagTableId(i: number) {
    return this.gettageBody().at(i).get('tagTableId')?.value;
  }
  tagcreatorId(i: number) {
    return this.gettageBody().at(i).get('creatorId')?.value;
  }
  deletetagDialog(i:number){
    const loginuserId=localStorage.getItem("id");
    if(this.tagcreatorId(i)==null){
    this.gettageBody().removeAt(i)
    }else if(this.tagcreatorId(i)==loginuserId){
      const tagid=this.tagTableId(i)
      this.ChooseTaskOption(tagid,i)
    }else{
      this.gettageBody().removeAt(i)
    }
  }

  ChooseTaskOption(id:any,i:any){
    const ChooseTaskOption = this.dialog.open(ConformationComponent, {
      width: '400px',
      autoFocus: false,
      data: { type:'tagdeleteconformation'},
      disableClose: true
    });
    ChooseTaskOption.afterClosed().subscribe((result: any) => {
      console.log(result)
      if(result){
        if (result=='2') {
          this.gettageBody().removeAt(i)
        this.manageContactsService.deletetag(id).subscribe((result) => {
      }), ((error:any) => {
      })
        }else if (result=='1'){
          this.gettageBody().removeAt(i)
        }
      }
    })
  }

  filterPredecessor(){
    if(this.form?.value.ListofPredecessor.length!=0){
      this.form?.value.ListofPredecessor.forEach((id:any) => {
        const data=this.listofisSuccessor
        this.listofisSuccessor = data.filter((option:any) =>
          option.taskId!=id
        );
      });
    }
  }
  
  filterSuccessor(){
    if(this.form?.value.ListofSuccessor.length!=0){
      this.form?.value.ListofSuccessor.forEach((id:any) => {
        const data=this.listofisPredecessor
        this.listofisPredecessor = data.filter((option:any) =>
          option.taskId!=id
        );
      });
    }
  }

  showdropdown() {
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage(
        'This button allows you to add more parameter',
        'Add Tag'
      );
    } else {
      const openAddEventDialog = this.dialog.open(AddtagCommonComponent, {
        width: '500px',
        autoFocus: false,
        disableClose: true,
        data: 'Events',
      });
      openAddEventDialog.afterClosed().subscribe((result: any) => {
        if (result) {
          this.gettageBody().clear();
          this.gettags();
        }
      });
    }
  }
  gettags() {
    this.manageUsersService.gettag('Events').subscribe((data: any) => {
      if (data) {
        data.forEach((element:any, index:any) => {
          this.addtageBody();
          this.gettageBody().at(index).get('tagTableId')?.setValue(element?.tagTableId);
          this.gettageBody().at(index).get('creatorId')?.setValue(element?.creatorId);
          this.gettageBody().at(index).get('fieldName')?.setValue(element?.fieldName);
          this.gettageBody().at(index).get('fieldType')?.setValue(element?.fieldType);
          this.gettageBody().at(index).get('fieldValue')?.setValue(element?.fieldValue);
          this.gettageBody().at(index).get('dropdownvaluetotal')?.setValue(element?.dropdownValues);
        });
      }
      this.tags = data;
    });
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
  onRadioChange(event: any) {
    this.form.get('pipelineID')?.setValue(null)
    this.form.get('Pipelinename')?.setValue('')

  } 

  // -----------
  onSubmit() {
    this.form?.value.AddSteps.forEach((element:any, index:any) => {
      element.Step=element.Step?element.Step:index+1
    });
    this.form.get('keyword')?.setValue(this.keywordlist);
    const formData = new FormData();
    if (this.form.get('UserId')?.value) {
      this.form.get('Stage')?.setValue(1)
      formData.append('NumberOfUsers',this.form?.value.UserId.length )
      formData.append('Stage', '1');
    } else {
      formData.append('Stage', '2');
      formData.append('NumberOfUsers','0')
      this.form.get('Stage')?.setValue(2)
    }
    formData.append('Title', this.form.get('Title')?.value);
    formData.append('IsPublic',this.form?.value.IsPublic);
    if (this.screenType == 'Create-subTask') {
      formData.append('ParentId', this.form.get('ParentId')?.value);
    }
    const endDate= this.datepipe.transform(this.form?.value.EndDate, 'yyyy-MM-dd')
    const EndTime=this.form?.value.EndTime==null?'00:00':this.form?.value.EndTime
  formData.append('EndDate', endDate+'T'+EndTime);
    formData.append('PermittedUserIds', this.form.get('PermittedUserIds')?.value);
    formData.append('IsPredecessortask', this.form.get('IsPredecessortask')?.value);
    formData.append('IsSuccessortask', this.form.get('IsSuccessortask')?.value);
    formData.append('initiatives', this.form.get('initiatives')?.value);
    formData.append('ListofSuccessor', this.form.get('ListofSuccessor')?.value);
    formData.append('ListofPredecessor', this.form.get('ListofPredecessor')?.value);
    formData.append('Address', this.form.get('Address')?.value);
    formData.append('ZipCode', this.form.get('ZipCode')?.value);
    formData.append('City', this.form.get('City')?.value );
    formData.append('Country', this.form.get('Country')?.value);
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
    formData.append('IsTemplate', this.form.get('IsTemplate')?.value);
    formData.append('keyword', this.form.get('keyword')?.value);
    formData.append('IsMileStone', this.form?.value.IsMileStone)
    formData.append('HasStep', this.form.get('HasStep')?.value);
    // HasStep 
    if(this.form?.value.pipelineID) {
      formData.append('pipelineID', this.form.get('pipelineID')?.value);
    }
    
    if (this.form.get('HasStep')?.value == true) {
      
      formData.append('Pipelinename', this.form.get('Pipelinename')?.value);
      if (this.form.get('PipeLinetype')?.value == '1') {
        // Set isSavePipeline to true
        this.form.get('IsSavePipeline')?.setValue(true)
        formData.append('IsSavePipeline', 'true');
      } else {
        // Set isSavePipeline to fasle
        this.form.get('IsSavePipeline')?.setValue(false)
        formData.append('IsSavePipeline', 'false');
      }
      //  steps 
      if (this.form?.value.AddSteps.length != 0) {
        this.form?.value.AddSteps.forEach((element:any, index:any) => {
          formData.append('StepsViewModel[' + index + '].Step', element.Step?element.Step:index+1);
          formData.append('StepsViewModel[' + index + '].name', element.name);
          formData.append('StepsViewModel[' + index + '].Progress', element.Progress);
        });
      } 
    }
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
    if (this?.value == 1) {
      for (var x = 0; x < this.selectedDays.length; x++) {
        formData.append('NamesOfDay[' + x + ']', this.selectedDays[x]);
      }
    }
    if(this.form.get('SiteId')?.value){
      formData.append('SiteId', this.form.get('SiteId')?.value);
    }
    if(this.form.get('CategoryId')?.value){
      formData.append('CategoryId', this.form.get('CategoryId')?.value || 0);
    }

    if(this.form.get('UserId')?.value){
      for (var x = 0; x < this.form.get('UserId')?.value.length; x++) {
        formData.append('UserId[' + x + ']', this.form.get('UserId')?.value[x]);
      }
    }

    if(this.form.get('ContactId')?.value){
      for (var x = 0; x < this.form.get('ContactId')?.value.length; x++) {
        formData.append(
          'ContactId[' + x + ']',
          this.form.get('ContactId')?.value[x]
        );
      }
    }
    if(this.form.get('UserGroupsId')?.value){
      for (var x = 0; x < this.form.get('UserGroupsId')?.value.length; x++) {
        formData.append(
          'UserGroupsId[' + x + ']',
          this.form.get('UserGroupsId')?.value[x]
        );
      }
    }
    if(this.form.get('ContactGroupsId')?.value){
      for (var x = 0; x < this.form.get('ContactGroupsId')?.value.length; x++) {
        formData.append('ContactGroupsId[' + x + ']', this.form.get('ContactGroupsId')?.value[x]);
      }
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
    if (this.form?.value.Addtages.length != 0 ) {
      this.form?.value.Addtages.forEach((e:any,index:number) => {
        console.log(index)
        if(e.dropdownValues!=''||e.dropdownValues!=null||e.fieldValue!=''||e.fieldValue!=null){
          formData.append('TagViewModels[' + index + '].fieldName', e.fieldName);
          formData.append('TagViewModels[' + index + '].fieldType', e.fieldType);
          if (e.fieldType == 'Dropdown') {
            formData.append( 'TagViewModels[' + index + '].dropdownValues', e.dropdownValues);
          } else {
            formData.append( 'TagViewModels[' + index + '].fieldValue', e.fieldValue);
          }
        }
      }); 
    }
    if (this.screenType == 'Create-task-initiatives' || this.screenType == 'edit-task-initiatives'||
     this.screenType == 'addsubtask'||this.screenType == 'View-subtask-initiatives'||this.screenType == 'edit-subtask-initiatives') {
      this.matDialogRef.close(this.form?.value);
    } else {
      if (this.form.get('id')?.value) {
        formData.append('id', this.form.get('id')?.value);
        this.manageUserService.UpdateTaskById(formData).subscribe((res: any) => {
          if (res.response[0].code =='200'||res.response[0].code ==200) {
            this.messageService.showMessage(res.response[0].message);
            this.matDialogRef.close(this.form?.value);
          } else {
            this.messageService.showMessage(res.response[0].message);
            this.matDialogRef.close(this.form?.value);
          }
        }, error => {
          console.log(error)
          if (error.status == 429) {
            this.APIerrormessage(error?.error, 'Update milestone')
          }
        })
      } else {
        this.calendarService.createTask(formData).subscribe((res: any) => {
          if (res.code =='200'||res.code ==200) {
            this.messageService.showMessage(res.message);
            this.matDialogRef.close(this.form?.value);
          } else {
            this.messageService.showMessage(res.message);
            this.matDialogRef.close(this.form?.value);
          }
        }, error => {
          console.log(error)
          if (error.status == 429) {
            this.APIerrormessage(error?.error, 'Create milestone')
          }
        });
      }
    }

  }

  getlinkedpredecessor(id:any){
    this.userService.GetLinkedTasks(id,false,true).subscribe((result)=>{
      if(result){
        this.predecessorlist=result.map((ele:any)=>{
          return ele.id
        })
      }
    })
}


getlinkedsuccessor(id:any){
    this.userService.GetLinkedTasks(id,true,false).subscribe((result)=>{
      if(result){
        this.successorlist=result.map((ele:any)=>{
          return ele.id
        })
      }
    })
  }
  

  getOneTask() {
    this.form.get('id')?.setValue(this.taskiddata.id) 
    this.form.get('EndTime')?.setValue(this.taskiddata?.endTime ? this.taskiddata?.endTime : this.taskiddata?.EndTime)
    this.form.get('EndDate')?.setValue(this.taskiddata?.EndDate ? this.taskiddata?.EndDate : this.taskiddata?.EndDate)
    this.form.get('Title')?.setValue(this.taskiddata?.title ? this.taskiddata?.title : this.taskiddata?.Title)
    this.form.get('Title')?.setValue(this.taskiddata?.title ? this.taskiddata?.title : this.taskiddata?.Title)
    this.form.get('Address')?.setValue(this.taskiddata?.address ? this.taskiddata?.address : this.taskiddata?.Address)
    this.form.get('City')?.setValue(this.taskiddata?.city ? this.taskiddata?.city : this.taskiddata?.City)
    this.form.get('Country')?.setValue(this.taskiddata?.country ? this.taskiddata?.country : this.taskiddata?.Country)
    this.form.get('ZipCode')?.setValue(this.taskiddata?.zipCode ? this.taskiddata?.zipCode : this.taskiddata?.ZipCode)
    this.form.get('Description')?.setValue(this.taskiddata?.description ? this.taskiddata?.description : this.taskiddata?.Description)
    this.form.get('CriticityId')?.setValue(this.taskiddata?.criticityId ? this.taskiddata?.criticityId : this.taskiddata?.CriticityId)
    this.form.get('CategoryId')?.setValue(this.taskiddata?.categoryId ? this.taskiddata?.categoryId : this.taskiddata?.CategoryId)
    this.form.get('HasStep')?.setValue(this.taskiddata?.HasStep ? this.taskiddata?.hasStep : this.taskiddata?.hasStep)
    this.form.get('initiatives')?.setValue(this.taskiddata?.initiativeId.split(','))
    if(this.taskiddata?.isPublic==true){
      this.form.get('IsPublic')?.setValue(this.taskiddata?.isPublic)
    }
    if(this.taskiddata?.isPublic==false){
      this.form.get('IsPublic')?.setValue(this.taskiddata?.isPublic)
      let data:any=[]
      this.taskiddata?.permittedUsers.forEach((element:any) => {
        data.push(element.id)
      });
    this.form.get('PermittedUserIds')?.setValue(data)
    }
    if(this.taskiddata?.successorTaskcount!=0){ this.getlinkedsuccessor(this.taskiddata?.id)}
    if(this.taskiddata?.predecessorTaskcount!=0){this.getlinkedpredecessor(this.taskiddata?.id)}
    if (this.screenType == 'edit-task-initiatives' || this.screenType == 'View-task-initiatives') {
      this.form.get('SiteId')?.setValue(this.taskiddata?.siteId ? this.taskiddata?.siteId : this.taskiddata?.SiteId)
      this.form.get('UserId')?.setValue(this.taskiddata?.UserId);
      this.form.get('ContactId')?.setValue(this.taskiddata?.ContactId);
      this.form.get('ContactGroupsId')?.setValue(this.taskiddata?.ContactGroupsId);
      this.form.get('UserGroupsId')?.setValue(this.taskiddata?.UserGroupsId);
      if (this.taskiddata?.keyword && this.taskiddata?.keyword.length > 0) {
        this.keywordlist = [];
        this.taskiddata?.keyword.forEach((keyword:any) => {
          this.keywordlist.push(keyword);
        });
      }
    } else {
      this.form.get('SiteId')?.setValue(this.taskiddata.sitedetaildto.id)
      if (this.taskiddata) {
        this.form.get('Minutes')?.setValue(this.taskiddata.minutes.toString())
        this.form.get('Hours')?.setValue(this.taskiddata.hours.toString())
      }

      if (this.taskiddata.assignedTo && this.taskiddata.assignedTo.length > 0) {
        const userIds = this.taskiddata.assignedTo.map((item:any) => item.id);
        this.form.get('UserId')?.setValue(userIds);
      }
      if (this.taskiddata.contactdtls && this.taskiddata.contactdtls.length > 0) {
        const contactIds = this.taskiddata.contactdtls.map((item:any) => item.id);
        this.form.get('ContactId')?.setValue(contactIds);
      }
      if (this.taskiddata.keywords && this.taskiddata.keywords.length > 0) {
        this.keywordlist = [];
        this.taskiddata.keywords.forEach((keyword:any) => {
          this.keywordlist.push(keyword);
        });
      }
    }
    this.form.get('ListofSuccessor')?.setValue(this.predecessorlist)
    this.form.get('ListofPredecessor')?.setValue(this.successorlist)
    if(this.taskiddata?.stepsCount > 0 && this.taskiddata?.hasStep == true){
      this.form.get('pipelineID')?.setValue(this.taskiddata?.pipelineId)
      this.manageUserService.FindTaskSteps(this.data.data.id).subscribe((res: any) => {
        this.FindTaskStep = res;
        console.log("findStep", this.FindTaskStep)
        this.FindTaskStep.forEach((element:any , index:any) => {
          this.AddSteps();
          this.getSteps().at(index).get('name')?.setValue(element.name ? element.name : element.stepName)
          this.getSteps().at(index).get('Step')?.setValue(element.step)
          this.getSteps().at(index).get('Progress')?.setValue(element.progress)

        })
      })
      
    }

  }

  updateGroup(id:any) {
    console.log(id);
    let selectedRes :any= [];
    let usegrps :any= [];
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
  changeTradesByCategory(event:any, id:any) {
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
    let array1 :any= [];
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
    if (eve?.value == undefined) {
      this.googleAutoinputScreen = true;
      this.NormalAddressScreen = false;
      this.form.get('Address')?.setValue(null);
      this.form.get('ZipCode')?.setValue(null);
      this.form.get('City')?.setValue(null);
      this.form.get('Country')?.setValue(null);
    } else {
      this.googleAutoinputScreen = false;
      this.NormalAddressScreen = true;
      this.manageSitesService.fetchSiteByIdService(eve?.value).subscribe((res) => {
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
    console.log(event?.value);
    const value = (event?.value || '').trim();
    if (value) {
      this.keywordlist.push(value);
    }
    // Clear the input value
    // event.input?.value = '';
    this.form.get('keyword')?.setValue(null);
  }
  remove(value: string) {
    const index = this.keywordlist.indexOf(value);
    if (index >= 0) {
      this.keywordlist.splice(index, 1);
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
    console.log(this.form?.value);
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
    this.form.get('numeralType')?.valueChanges.subscribe((val:any) => {
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

  GroupToSingleconvert(group:any) {
    this.manageUsersService.getGroupUserService(group.id).subscribe((data: any) => {
      if (data) {
        const ids:any = []
        data.forEach((element:any) => {
          ids.push(element.id)
          console.log(element)
        })
        if(this.form?.value.UserId.length!=0){
          this.form?.value.UserId.forEach((element:any) => {
            ids.push(element)
          });
        }
        this.form.get('UserId')?.setValue(ids)
      }
    });
  }

  getdatafordroupdown() {
    this.getAllcountryList();
    this.getAllPipelines()
    this.getAllinitiatives()
    this.getAllisPredecessor()
    this.getAllisSuccessor()
    // get all users
    this.userService.findAllUsersDropdown().subscribe((result) => {
      if (result) {
        this.users$ = result;
        this.filteredusers = result;
      }
    });

    this.manageUsersService.findAllUsersGroupDropdown().subscribe((res) => {
      this.userGroups$ = res;
      this.userGroups$.sort(function (a:any, b:any) {
        var textA = a.groupName.toUpperCase();
        var textB = b.groupName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.filteredList4 = this.userGroups$.slice()
    })


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
      this.form.get('ZipCode')?.setValue(null);
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

